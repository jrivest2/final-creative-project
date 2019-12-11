var app = new Vue({
  el: '#app',
  data: {
    posts: [],

  },
  methods: {
    async getPosts() {
      try {
        let response = await axios.get("/api/items");
        this.posts = response.data;
        console.log(this.posts);
        return true;
      } catch (error) {
        console.log(error);
      }
    },
    //
    //Go through and change this to tally number of likes a post has.
    //
    tallyPost(post) {
      post.likes += .5;
      this.editPost(post);

    },
    async editPost(post) {
      console.log(post);
      try {
        let response = await axios.put("/api/items/" + post._id, {
          user: post.user,
          description: post.description,
          likes: post.likes,
        });
        this.getPosts();
        return true;
      }
      catch (error) {
        console.log(error);
      }
    },
  },
  created() {
    this.getPosts();
  },
});