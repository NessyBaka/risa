let d = {
    searching:'',
    found:[],
    showing:[],
    page:0,
    max:6,
    meta:undefined,
    start:()=>{
        fetch('./meta.json').then(r=>{
            r.json().then(j=>{
                d.meta=j;
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
    }
},
    risa=new Vue({el:"#risa",data:d})

d.start()