let d = {
    cookies:{},
    found:[],
    showing:[],
    meta:undefined,
    video:null,
    skinID:null,

    //Params
    max:6,//Max items per page

    //Get/Set variables
    _search_query:'',
    _page_now:0,
    _skin:null,

    //Getters
    get search_query(){return this._search_query},
    get page(){return this._page_now},
    get vskin(){return this._skin},
    //Setters
    set search_query(query){
        this._search_query = query||'';
        this.search(this._search_query);
    },
    set page(page_query){
        this._page_now = page_query >= 0 ? page_query : 0;
        this.show(this._page_now);
    },
    set vskin(skin_ID){
        this.skinID = skin_ID;
        this._skin = this.searchSkin(skin_ID);
    },

    //Functions
    start:()=>{
        //meta.json?t=<timestamp> - CACHING H A C K S
        fetch('./meta.json?t='+Date.now()).then(r=>{
            r.json().then(j=>{
                d.meta=j;
                d.meta.skins = d.meta.skins.reverse();
                d.checkForStartupCookies();
                d.checkHashAtStart();
                d.search();
            })
        }).catch(e=>{console.log(e)})
    },
    search:(query)=>{
        d.page = 0;

        if(!query){
            d.found = d.meta.skins;
            d.show(0)
            return;
        }

        let found = [],
            length = d.meta.skins.length;

        for(var i = 0; i < length; i++){
            let n = d.meta.skins[i].name,
                q = new RegExp(query, 'i')

            if(d.meta.skins[i].author) n += " " + d.meta.skins[i].author

            if((q).exec(n))
                found.push(d.meta.skins[i])
        }

        d.found = found;
        d.show(0)
    },
    show:(page)=>{
        d.showing = [];

        let l = d.found.length;
        for(var i = page*d.max; i < (page*d.max)+d.max; i++){
            if(i >= l) break;

            d.showing.push(d.found[i])
        }
    },
    checkCookies(){
        let c = document.cookie.split(';');
        for(let i = 0; i < c.length; i++){
            let cookie = c[i].split('=');
            d.cookies[cookie[0]] = cookie[1]
        };
    },
    checkForStartupCookies(){
        d.checkCookies();
        document.cookie += "v="+Date.now().toString()+';';
        /* TODO: (not here) check for time changes */
    },
    checkHashAtStart(){
        d.vskin=document.location.hash.substr(1,document.location.hash.length);
    },
    searchSkin(ID){
        if(ID==null)
            return ID

        let l = d.meta.skins.length;
        for(let i = 0; i < l;i++){
            if(d.meta.skins[i].id == ID)
                return d.meta.skins[i]
        }

        return null;
    },
    closeSkinCard(){
        document.location.href = '#'
        d.vskin = null;
    }
},
    f = {},
    risa=new Vue({el:"#risa",data:d,methods:cm});

Object.assign(cm,f);
d.start()