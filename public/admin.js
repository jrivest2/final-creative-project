var app = new Vue({
  el: '#admin',
  data: {
    title: "",
    file: null,
    addItem: null,
    items: [],
    findTitle: "",
    findItem: null,
    price: "",
    purchase: false,
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
          title: this.title,
          path: r1.data.path,
          price: this.price,
          purchase: this.purchase,
        });
        this.addItem = r2.data;
      }
      catch (error) {
        console.log(error);
      }
    },
    async getItems() {
      try {
        let response = await axios.get("/api/items");
        console.log(response);
        this.items = response.data;
        return true;
      }
      catch (error) {
        console.log(error);
      }
    },
    selectItem(item) {
      this.findTitle = "";
      this.findItem = item;
    },
    async deleteItem(item) {
      try {
        let response = await axios.delete("/api/items/" + item._id);
        this.findItem = null;
        this.getItems();
        return true;
      }
      catch (error) {
        console.log(error);
      }
    },
    async editItem(item) {
      try {
        let response = await axios.put("/api/items/" + item._id, {
          title: this.findItem.title,
          price: this.findItem.price,
        });
        this.findItem = null;
        this.getItems();
        return true;
      }
      catch (error) {
        console.log(error);
      }
    },
  },
  computed: {
    suggestions() {
      return this.items.filter(item => item.title.toLowerCase().startsWith(this.findTitle.toLowerCase()));
    },
    sortProducts: function() {
      function compare(item1, item2) {
        if (item1.title > item2.title) {
          return 1;
        }
        if (item1.title < item2.title) {
          return -1;
        }
        return 0;
      }
      return this.items.sort(compare);
    },
  },
  created() {
    this.getItems();
  },
});
