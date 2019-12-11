var app = new Vue({
  el: '#admin',
  data: {
    user: "",
    file: null,
    addPost: null,
    posts: [],
    findUser: "",
    findPost: null,
    description: "",
    likes: 0,
  },
  methods: {
    fileChanged(event) {
      this.file = event.target.files[0];
    },
    async upload() {
      try {
        const formData = new FormData();
        formData.append('photo', this.file, this.file.name);
        let r1 = await axios.post('/api/photos', formData);
        let r2 = await axios.post('/api/items', {
          user: this.user,
          path: r1.data.path,
          description: this.description,
          likes: this.likes,
        });
        this.addPost = r2.data;
      }
      catch (error) {
        console.log(error);
      }
    },
    async getPosts() {
      try {
        let response = await axios.get("/api/items");
        console.log(response);
        this.posts = response.data;
        return true;
      }
      catch (error) {
        console.log(error);
      }
    },
    selectPost(post) {
      this.findUser = "";
      this.findPost = post;
    },
    async deletePost(post) {
      try {
        let response = await axios.delete("/api/items/" + post._id);
        this.findPost = null;
        this.getPosts();
        return true;
      }
      catch (error) {
        console.log(error);
      }
    },
    async editPost(post) {
      try {
        let response = await axios.put("/api/items/" + post._id, {
          user: this.findPost.user,
          description: this.findPost.description,
        });
        this.findPost = null;
        this.getPosts();
        return true;
      }
      catch (error) {
        console.log(error);
      }
    },
  },
  computed: {
    suggestions() {
      return this.posts.filter(post => post.user.toLowerCase().startsWith(this.findUser.toLowerCase()));
    },
    sortProducts: function() {
      function compare(post1, post2) {
        if (post1.user > post2.user) {
          return 1;
        }
        if (post1.user < post2.user) {
          return -1;
        }
        return 0;
      }
      return this.posts.sort(compare);
    },
  },
  created() {
    this.getPosts();
  },
});
