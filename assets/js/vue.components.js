let cm = {
    dummy: function(){return false},
    urler: function(link){
        //URL maker for css binds
        return 'url('+link+')'
    },
    itp: function(link, size="l", forceJPG=true){
        //ITP - Imgur Thumbnail Preview lol
        //recently, I found that you can use name suffixes to specify size of image preview
        //so there's 6 suffixes that we can use:
        /*
            Note: since images can be not only the squares - W will represent the converted width
            s - 90x90 (square)
            b - 160x160 (square)
            t - 160xN
            m - 320xN
            l - 640xN (default)
            h - 1024xN
        */
        // Thanks to https://thomas.vanhoutte.be/miniblog/imgur-thumbnail-trick/
        if(link==null)
            return null

        let o = new URL(link),
            s = o.pathname.split('.'),
            e = s.pop(),
            n = s.pop();

        if(o.host == 'i.imgur.com')
            o.pathname = n+size+'.'+(forceJPG?'jpg':e);

        return o.href;
    },
    yte: function(link, id=false){
        //YTE - YouTube Embed mhm, yes
        //If so, it can be used as iframe linker to other video-services
        if(!link)
            return null

        let y = new URL(link),
            p = y.searchParams.get('v');

        if(id)
            return p;

        if(p!=null)
            return "https://www.youtube.com/embed/"+p+"?origin=http://a.nessy.pw/"

        return link
    }
}

/* Skin screenshots component */
Vue.component('screenshots', {
    props:['skin'],
    methods:cm,
    template:`<div class="card-img-top screenshots" :class="{nsfw:skin.nsfw}">
    <screenshot
        v-if="skin.img && skin.img.length>0"
        v-for="img in this.skin.img"
        :key="img" :src="img"></screenshot>
    <div
        v-if="this.skin.v && (!this.skin.img || this.skin.img.length <= 2)"
        class="sblock video"
        title="(Video Preivew) Click to open the video preview"
        :style="{backgroundImage: this.urler('https://img.youtube.com/vi/'+this.yte(this.skin.v,true)+'/0.jpg')}"
        @click="$emit('video-click', skin.v)"></div>
</div>`
})

Vue.component('screenshot', {
    props:['src'],
    methods:cm,
    template:`<a
    class="sblock screenshot"
        :href="src" target="_blank"
        title="Click on image to open it in full size."
        :style="{backgroundImage: this.urler(this.itp(this.src))}"></a>`
})

/* Skin Name Title component */
Vue.component('skin-title', {
    props:['skin'],
    template:`
    <h5 class="card-title skin-name" :title="this.skin.name||'Fancy Skin #'+this.skin.id">
        <a
            class="text-dark" :href="'#'+this.skin.id"
            @click="$emit('title-click', skin.id)">{{this.skin.name||"Fancy Skin #"+this.skin.id}}</a>
        <a :href="'#'+skin.id" class="btn btn-link sqs-btn title-linker-btn" target="_blank"></a>
    </h5>`
})

/*
    Tags component
    ---------------------
    (FNT - force no tags)
    Tags for skin
    now it will be automated
    the tags will be:
    + "no screenshots" - when there's no ... uh screenshots
    + "unknown origin/author" - when there's no origin links or author links (two separate tags)
    + "modded/mix" - when the skin is modded or mixed (these ones should be declared in skin meta)
    + "only video" - when there's no screenshots and only video available
    + "nsfw" - not. safe. for. work. (maybe)
*/
Vue.component('skin-tags', {
    props:['skin'],
    template:`<div class="card-tags" v-if="!this.skin.fnt">
    <span class="badge badge-danger" v-if="this.skin.nsfw">NSFW</span>
    <span class="badge badge-warning" v-if="!this.skin.img || this.skin.img.length<=0">No screenshots</span>
    <span class="badge badge-warning" v-if="this.skin.v && (!this.skin.img || (!this.skin.img.s && !this.skin.img.p))">Only video</span>
    <span class="badge badge-info" v-if="!this.skin.link">Unknown origin</span>
    <span class="badge badge-info" v-if="!this.skin.author">Unknown author</span>
    <span class="badge badge-success" v-if="this.skin.mod">Modded/Mixed</span>
</div>`
})

Vue.component('skin-video', {
    props:['video'],
    methods:cm,
    template:`<iframe :src="yte(this.video)" frameborder="0" allow="fullscreen"></iframe>`
})