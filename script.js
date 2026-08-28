const STORAGE_KEY = "whisper-wall-v1";

    const text = document.getElementById("text");
    const remaining = document.getElementById("remaining");
    const publish = document.getElementById("publish");
    const feed = document.getElementById("feed");
    const filter = document.getElementById("filter");
    const toast = document.getElementById("toast");

    let category = "Thought";

    function getPosts(){
      try{
        return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
      }catch{
        return [];
      }
    }

    function savePosts(posts){
      localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
    }

    function escapeHTML(value){
      const div = document.createElement("div");
      div.textContent = value;
      return div.innerHTML;
    }

    function ago(date){
      const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
      if(seconds < 60) return "just now";
      const minutes = Math.floor(seconds / 60);
      if(minutes < 60) return minutes + "m ago";
      const hours = Math.floor(minutes / 60);
      if(hours < 24) return hours + "h ago";
      const days = Math.floor(hours / 24);
      if(days < 30) return days + "d ago";
      const months = Math.floor(days / 30);
      if(months < 12) return months + "mo ago";
      return Math.floor(months / 12) + "y ago";
    }

    function showToast(message){
      toast.textContent = message;
      toast.classList.add("show");
      clearTimeout(showToast.timer);
      showToast.timer = setTimeout(() => toast.classList.remove("show"), 2200);
    }

    function render(){
      let posts = getPosts();
      const selected = filter.value;

      if(selected !== "All"){
        posts = posts.filter(p => p.category === selected);
      }

      if(!posts.length){
        feed.innerHTML = `
          <div class="empty">
            <div class="mark">∅</div>
            <div>No words here yet. Be the first.</div>
          </div>`;
        return;
      }

      feed.innerHTML = posts.map(p => `
        <article class="card">
          <div class="meta">
            <span class="tag">${escapeHTML(p.category)}</span>
            <span class="time">${ago(p.createdAt)}</span>
          </div>

          <div class="message">${escapeHTML(p.message)}</div>

          <div class="actions">
            <button class="action ${p.liked ? "liked" : ""}" onclick="likePost('${p.id}')">
              ${p.liked ? "♥" : "♡"} ${p.likes}
            </button>
            <button class="action delete" onclick="deletePost('${p.id}')">remove</button>
          </div>
        </article>
      `).join("");
    }

    document.querySelectorAll(".chip").forEach(chip => {
      chip.addEventListener("click", () => {
        document.querySelectorAll(".chip").forEach(c => c.classList.remove("active"));
        chip.classList.add("active");
        category = chip.dataset.category;
      });
    });

    text.addEventListener("input", () => {
      remaining.textContent = 500 - text.value.length;
    });

    publish.addEventListener("click", () => {
      const message = text.value.trim();

      if(!message){
        showToast("Write something first.");
        text.focus();
        return;
      }

      const posts = getPosts();

      posts.unshift({
        id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
        message,
        category,
        likes: 0,
        liked: false,
        createdAt: new Date().toISOString()
      });

      savePosts(posts);
      text.value = "";
      remaining.textContent = "500";
      render();
      showToast("Left anonymously.");
    });

    filter.addEventListener("change", render);

    window.likePost = function(id){
      const posts = getPosts();
      const p = posts.find(x => x.id === id);
      if(!p) return;

      p.liked = !p.liked;
      p.likes += p.liked ? 1 : -1;

      savePosts(posts);
      render();
    };

    window.deletePost = function(id){
      if(!confirm("Remove this post from this browser?")) return;

      savePosts(getPosts().filter(p => p.id !== id));
      render();
      showToast("Post removed.");
    };

    render();
