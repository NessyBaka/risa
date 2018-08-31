let d = {
    found:[],
    showing:[],
    meta:undefined,

    //Params
    max:6,//Max items per page

    //Get/Set variables
    _search_query:'',
    _page_now:0,

    //Getters
    get search_query(){return this._search_query},
    get page(){return this._page_now},
    //Setters
    set search_query(query){
        this._search_query = query||'';
        this.search(this._search_query);
    },
    set page(page_query){
        this._page_now = page_query >= 0 ? page_query : 0;
        this.show(this._page_now);
    },

    //Functions
    start:()=>{
        //meta.json?t=<timestamp> - CACHING H A C K S
        fetch('./meta.json?t='+Date.now()).then(r=>{
            r.json().then(j=>{
                d.meta=j;
                d.meta.skins = d.meta.skins.reverse()
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
        //TODO:check cookies
    }
},
    risa=new Vue({el:"#risa",data:d});

d.start()