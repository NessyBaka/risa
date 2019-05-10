let d = {
    found: [],
    showing: [],
    indexes: undefined,
    skins: undefined,
    _m: undefined,
    video: null,
    skinID: null,

    //Params
    max: 6, //Max items per page

    //Get/Set variables
    _search_query: undefined,
    _page_now: 0,
    _skin: null,

    //Getters
    get search_query() {
      return this._search_query;
    },
    get page() {
      return this._page_now;
    },
    get modal() {
      return this._skin;
    },
    //Setters
    set search_query(query) {
      this._search_query = query || "";
      this.search(this._search_query);
    },
    set page(page_query) {
      this._page_now = page_query >= 0 ? page_query : 0;
      this.show(this._page_now);
    },
    set modal(skin_ID) {
      this.skinID = skin_ID;
      this._skin = this.searchSkin(skin_ID);
    },

    //Functions
    start: () => {
      document.cookie = "theme=deep-dark";
      d.grab("./meta.json?t=" + Date.now())
        //meta.json?t=<timestamp> - CACHING H A C K S
        .then(_ => {
          d.checkHashAtStart();
          d.search();
        })
        .catch(e => console.log(e));
    },
    grab: (p = "./meta.json") =>
      new Promise((done, oof) => {
        return fetch(p)
          .then(r => {
            if (r.ok) return r.json();
            else throw r;
          })
          .then(json => {
            d._meta = json;
            d.indexes = d._meta.index;
            d.skins = d._meta.skins;

            return done();
          })
          .catch(oof);
      }),
    search: query => {
      d.page = 0;

      if (!query) {
        d.found = d.skins;
        d.show(0);
        return;
      }

      let found = [],
        qpattern = new RegExp(
          query.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&"),
          "i"
        ),
        length = d.indexes.length;

      for (var i = 0; i < length; i++)
        if (qpattern.test(d.indexes[i])) found.push(d.skins[i]);

      d.found = found;
      d.show(0);
    },
    show: page => {
      d.showing = [];

      let l = d.found.length;
      for (var i = page * d.max; i < page * d.max + d.max; i++) {
        if (i >= l) break;

        d.showing.push(d.found[i]);
      }
    },
    checkHashAtStart() {
      d.modal = document.location.hash.substr(1, document.location.hash.length);
    },
    searchSkin(ID) {
      if (ID == null) return ID;

      let l = d.skins.length;
      for (let i = 0; i < l; i++) {
        if (d.skins[i].id == ID) return d.skins[i];
      }

      return null;
    },
    closeSkinCard() {
      document.location.href = "#";
      d.vskin = null;
    }
  },
  f = {},
  risa = new Vue({ el: "#risa", data: d, methods: cm });

Object.assign(cm, f);
d.start();
