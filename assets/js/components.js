let cm = {
  dummy: function() {
    return false;
  },
  urler: function(link) {
    //URL maker for css binds
    return "url(" + link + ")";
  },
  itp: function(link, size = "l", forceJPG = true) {
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
    if (link == null) return null;
    else return link;

    /* Instead, we return the link, cause, uh, no need to resize */

    /* let o = new URL(link),
            s = o.pathname.split('.'),
            e = s.pop(),
            n = s.pop();

        if(o.host == 'i.imgur.com')
            o.pathname = n+size+'.'+(forceJPG?'jpg':e);

        return o.href; */
  },
  yte: function(link, id = false) {
    //YTE - YouTube Embed mhm, yes
    //If so, it can be used as iframe linker to other video-services
    if (!link) return null;

    let y = new URL(link),
      p = y.searchParams.get("v");

    if (id) return p;

    if (p != null)
      return (
        "https://www.youtube.com/embed/" + p + "?origin=http://a.nessy.pw/"
      );

    return link;
  },
  copy: function(v = null, d = "https://aneyo.github.io/risa/") {
    let c = document.querySelector("#copy-value");
    c.setAttribute("type", "text");
    c.value = d + "#" + v;
    c.select();

    try {
      document.execCommand("copy");
    } catch (e) {
      console.error(e);
    }

    c.setAttribute("type", "hidden");
    window.getSelection().removeAllRanges();
  },
  downloadLink(id) {
    return "https://aneyo.github.io/risa/s/" + id + ".osk";
  }
};

/* Skin screenshots component */
Vue.component("screenshots", {
  props: ["skin"],
  methods: cm,
  template: `<div class="nr card-img-top screenshots" :class="{nsfw:skin.nsfw}">
    <screenshot
        v-if="skin.img && skin.img.length>0"
        v-for="img in this.skin.img"
        :key="img" :src="img"></screenshot>
    <div
        v-if="this.skin.v && (!this.skin.img || this.skin.img.length <= 2)"
        class="screenshot video"
        title="(Video Preivew) Click to open the video preview"
        :style="{backgroundImage: this.urler('https://img.youtube.com/vi/'+this.yte(this.skin.v,true)+'/0.jpg')}"
        @click="$emit('video-click', skin.v)"></div>
</div>`
});

Vue.component("screenshot", {
  props: ["src"],
  methods: cm,
  template: `<a
    class="nr screenshot"
        :href="src" target="_blank"
        title="Click on image to open it in full size."
        :style="{backgroundImage: this.urler(this.src)}"></a>`
});

/* Skin Name Title component */
Vue.component("skin-title", {
  props: ["skin"],
  template: `
    <h5 class="nr card-title name" :title="this.skin.name||'Fancy Skin #'+this.skin.id">
        <div style="flex:1">
            <a
                class="text-light" :href="'#'+this.skin.id"
                @click="$emit('title-click', skin.id)">{{this.skin.name||"Fancy Skin #"+this.skin.id}}</a>
            <br>
            <span class="nr author text-light">By <a :href="this.skin.alink">{{this.skin.author}}</a></span>
        </div>
        <a  href="#copy"
            @click="$emit('copy-click', skin.id)"
            title="Copy skin link to clipboard"><i class="far fa-clipboard"></i></a>
    </h5>`
});

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
Vue.component("skin-tags", {
  props: ["skin", "card"],
  template: `<div :class="{nr:true,tags:true,boxed:this.card}" v-if="!this.skin.fnt">
    <span class="tag badge badge-danger" v-if="this.skin.nsfw">NSFW</span>
    <span class="tag badge badge-warning" v-if="!this.skin.img || this.skin.img.length<=0">No screenshots</span>
    <span class="tag badge badge-warning" v-if="this.skin.v && (!this.skin.img || (!this.skin.img.s && !this.skin.img.p))">Only video</span>
    <span class="tag badge badge-info" v-if="!this.skin.link">Unknown origin</span>
    <span class="tag badge badge-info" v-if="!this.skin.author">Unknown author</span>
    <span class="tag badge badge-success" v-if="this.skin.mod">Modded/Mixed</span>
</div>`
});

Vue.component("skin-video", {
  props: ["video"],
  methods: cm,
  template: `<iframe :src="yte(this.video)" frameborder="0" allow="fullscreen"></iframe>`
});
