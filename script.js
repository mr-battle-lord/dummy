/*
  1. Create a Supabase project.
  2. Run supabase.sql in Supabase SQL Editor.
  3. Put your Project URL and ANON/PUBLISHABLE key below.
  NEVER put a service_role/secret key in this file.
*/
const SUPABASE_URL = "https://snsfrqygwrqlgyvenhys.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_A_bkxX5zU04wZYrzg9IGBw_Orct9wQw";

let db = null;

function startSupabase() {
  if (!window.supabase || typeof window.supabase.createClient !== "function") {
    console.error("Supabase library failed to load.");
    return false;
  }
  db = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  return true;
}

const text = document.getElementById("text");
const remaining = document.getElementById("remaining");
const publish = document.getElementById("publish");
const feed = document.getElementById("feed");
const filter = document.getElementById("filter");
const toast = document.getElementById("toast");

let category = "Thought";

function escapeHTML(value){
  const div = document.createElement("div");
  div.textContent = value;
  return div.innerHTML;
}

function ago(date){
  const seconds = Math.max(0, Math.floor((Date.now()-new Date(date).getTime())/1000));
  if(seconds<60)return "just now";
  const minutes=Math.floor(seconds/60);
  if(minutes<60)return minutes+"m ago";
  const hours=Math.floor(minutes/60);
  if(hours<24)return hours+"h ago";
  const days=Math.floor(hours/24);
  if(days<30)return days+"d ago";
  const months=Math.floor(days/30);
  if(months<12)return months+"mo ago";
  return Math.floor(months/12)+"y ago";
}

function showToast(message){
  toast.textContent=message;
  toast.classList.add("show");
  clearTimeout(showToast.timer);
  showToast.timer=setTimeout(()=>toast.classList.remove("show"),2200);
}

function likedKey(id){ return "whisper-liked-"+id; }
function hasLiked(id){ return localStorage.getItem(likedKey(id))==="1"; }
function setLiked(id,value){ localStorage.setItem(likedKey(id),value?"1":"0"); }

async function loadPosts(){
  if (!db) {
    feed.innerHTML = `<div class="empty"><div class="mark">!</div><div>Connecting to the wall…</div></div>`;
    return;
  }
  feed.innerHTML=`<div class="empty"><div class="mark">…</div><div>Loading the wall…</div></div>`;
  let query=db.from("posts").select("id,message,category,likes,created_at").order("created_at",{ascending:false}).limit(100);
  if(filter.value!=="All") query=query.eq("category",filter.value);

  const {data,error}=await query;
  if(error){
    console.error(error);
    feed.innerHTML=`<div class="empty"><div class="mark">!</div><div>Could not load the wall. Check your Supabase settings.</div></div>`;
    return;
  }

  if(!data.length){
    feed.innerHTML=`<div class="empty"><div class="mark">∅</div><div>No words here yet. Be the first.</div></div>`;
    return;
  }

  feed.innerHTML=data.map(p=>`
    <article class="card">
      <div class="meta">
        <span class="tag">${escapeHTML(p.category)}</span>
        <span class="time">${ago(p.created_at)}</span>
      </div>
      <div class="message">${escapeHTML(p.message)}</div>
      <div class="actions">
        <button class="action ${hasLiked(p.id)?"liked":""}" onclick="likePost('${p.id}',${p.likes})">
          ${hasLiked(p.id)?"♥":"♡"} ${p.likes}
        </button>
        <span class="action">anonymous</span>
      </div>
    </article>
  `).join("");
}

document.querySelectorAll(".chip").forEach(chip=>{
  chip.addEventListener("click",()=>{
    document.querySelectorAll(".chip").forEach(c=>c.classList.remove("active"));
    chip.classList.add("active");
    category=chip.dataset.category;
  });
});

text.addEventListener("input",()=>remaining.textContent=500-text.value.length);
filter.addEventListener("change",loadPosts);

publish.addEventListener("click",async()=>{
  if (!db) { showToast("Connection not ready. Refresh once."); return; }
  const message=text.value.trim();
  if(!message){showToast("Write something first.");text.focus();return;}

  publish.disabled=true;
  publish.textContent="Publishing…";

  const {error}=await db.from("posts").insert({message,category});
  publish.disabled=false;
  publish.textContent="Leave it anonymously";

  if(error){
    console.error(error);
    showToast("Could not publish. Check Supabase.");
    return;
  }

  text.value="";
  remaining.textContent="500";
  showToast("Left anonymously.");
  await loadPosts();
});

window.likePost=async(id,currentLikes)=>{
  if (!db) { showToast("Connection not ready. Refresh once."); return; }
  const already=hasLiked(id);
  if(already){showToast("You already liked this.");return;}

  const {error}=await db.from("posts").update({likes:currentLikes+1}).eq("id",id);
  if(error){showToast("Could not like this post.");return;}
  setLiked(id,true);
  await loadPosts();
};

async function startApp() {
  if (!startSupabase()) {
    feed.innerHTML = `<div class="empty"><div class="mark">!</div><div>Supabase could not load. Check your internet connection and refresh.</div></div>`;
    return;
  }

  await loadPosts();

  // Realtime is helpful but must never break the main app.
  try {
    db.channel("whisper-wall")
      .on("postgres_changes", {event:"*", schema:"public", table:"posts"}, () => loadPosts())
      .subscribe();
  } catch (e) {
    console.warn("Realtime unavailable:", e);
  }
}

startApp();
