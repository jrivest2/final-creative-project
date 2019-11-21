var app = new Vue({
  el: '#app',
  data: {
    items: [],
    purchasedItems: [],
    itemsInCart: false,
  },
  methods: {
    async getItems() {
      try {
        let response = await axios.get("/api/items");
        this.items = response.data;
        console.log(this.items);
        return true;
      } catch (error) {
        console.log(error);
      }
    },
    purchaseItems() {
      for (var i = 0; i < this.items.length; ++i) {
        if (this.items[i].purchase == true) {
          this.purchasedItems.push(this.items[i]);
        }
      }
      this.itemsInCart = true;
      console.log(this.purchasedItems);
      for (var i = 0; i < this.purchasedItems.length; ++i) {
        this.editItem(this.purchasedItems[i]);
      }
    },
    async editItem(item) {
      try {
        let response = await axios.put("/api/items/" + item._id, {
          title: item.title,
          price: item.price,
          purchase: item.purchase,
        });
        this.getItems();
        return true;
      }
      catch (error) {
        console.log(error);
      }
    },
  },
  created() {
    this.getItems();
  },
});