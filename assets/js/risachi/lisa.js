/*eslint no-undef: 0*/
Vue.component("skin-item", {
  props: {
    data: {
      type: Object,
      required: true
    },
    selected: {
      type: Boolean,
      required: true
    },
    index: Number
  },
  computed: {
    link() {
      return `${document.location.origin}/#${this.data.id}`;
    },
    name() {
      if (this.data.names != null && this.data.names.length > 0) return this.data.names[0];
      else return "(Unknown Skin Name)";
    },
    flags() {
      if (this.data.flags == null) return {};
      else return this.data.flags;
    },
    author() {
      if (this.data.author == null) return {};
      else return this.data.author;
    },
    links() {
      if (this.data.links == null) return {};
      else return this.data.links;
    },
    preview() {
      if (this.data.preview == null) return {};
      else return this.data.preview;
    },

    fileLink() {
      if (this.data.links != null && this.data.links.download != null) return this.data.links.download;
      else return `${document.location.origin}/download/${this.data.id}.osk`;
    },
    fileName() {
      if (this.data.names != null && this.data.names.length > 0) return `${this.data.names[0]}.osk`
      else return `${this.data.id || "a_skin"}.osk`;
    },
    copyID() {
      return `copy-${this.data.id}`;
    }
  },
  mounted() {
    if (this.selected) this.$nextTick(() => setTimeout(this.scrollTo, 250));
  },
  methods: {
    scrollTo() {
      this.$el.ownerDocument.documentElement.scrollTop = (this.index * 81);
    },
    select() {
      this.$emit("select", this.data.id);
    },
    copy() {
      let c = document.querySelector(`#${this.copyID}`)
      c.setAttribute('type', 'text')
      c.select()

      try {
        document.execCommand('copy');
      } catch (e) { console.error(e) }

      c.setAttribute('type', 'hidden')
      window.getSelection().removeAllRanges()
    }
  },
  template: `
  <div class="skin">
    <preview-component
      :id="data.id"
      :data="preview"
      :nsfw="flags.nsfw"
      :large="selected"
    ></preview-component>
    <div class="info-block">
      <div class="meta">
        <a class="meta-name" :href="link" @click.prevent="select">{{name}} <approved v-if="data.gold"></approved></a>
        <div class="meta-tags">
          <span class="nsfw tag" v-if="flags.nsfw"></span>
          <span :class="[flags.modded?'modded':'original','tag']"></span>
        </div>
        <div class="meta-author">
          by
          <a class="author-link" target="_blank" rel="noreferrer" :href="author.link" >{{author.name}}</a>
        </div>
      </div>
      <div class="other">
        <a class="copy-button" :href="link" @click.prevent="copy">
          <i class="fas fa-clipboard"></i>
        </a>
        <a class="source-button" target="_blank" rel="noreferrer" :href="links.origin" v-if="links.origin">
          <i class="fas fa-book"></i>
        </a>
        <a class="video-button" target="_blank" rel="noreferrer" :href="preview.video" v-if="preview.video">
          <i class="fab fa-youtube"></i>
        </a>
        <input type="hidden" :id="copyID" :value="link">
      </div>
    </div>
    <div class="download-button">
      <a :href="fileLink" :download="fileName" target="_blank">
        <i class="fas fa-download"></i>
      </a>
    </div>
  </div>`
});

Vue.component("preview-component", {
  props: {
    data: Object,

    skinId: {
      type: String,
      required: false
    },
    large: {
      type: Boolean,
      required: true,
      default: false
    },
    nsfw: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  computed: {
    hasData() {
      return this.data != null;
    },
    hasImages() {
      return this.hasData && this.data.big != null && this.data.big.length > 0;
    },
    hasThumb() {
      return this.hasData && (this.data.small != null || this.data.video != null);
    },
    thumbnail() {
      if (this.data.small != null) return this.data.small;
      else if (this.data.video != null) return this.videoThumbnail;
      else return null;
    },
    videoThumbnail() {
      if (!this.hasData || this.data.video == null) return null;

      let videoURL = new URL(this.data.video),
        id = videoURL.searchParams.get("v");

      if (id == null) id = videoURL.pathname.slice(1, videoURL.pathname.length);

      return `https://img.youtube.com/vi/${id}/mqdefault.jpg`
    }
  },
  methods: {
    swipe(index) {
      this.$refs["album"].scroll(
        this.$refs["album"].scrollLeft + this.$el.offsetWidth * index,
        0
      );
    }
  },
  template: `
  <div class="preview" :class="{nsfw}">
    <div v-if="large && hasImages" class="album-controls">
      <a class="album-control" href="#" @click.prevent="swipe(-1)">
        <i class="fas fa-angle-left"></i>
      </a>
      <a class="album-control" href="#" @click.prevent="swipe(1)">
        <i class="fas fa-angle-right"></i>
      </a>
    </div>

    <div v-if="large && hasImages" ref="album" key="large-preview" class="lazy-album">
      <lazy v-for="(screenshot, index) in data.big" :key="index" class="album-image" :src="screenshot"></lazy>
    </div>
    <lazy v-else-if="hasThumb" key="small-preview" class="lazy-preview" :src="thumbnail"></lazy>
  </div>`
});

Vue.component("lazy", {
  props: {
    src: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      loading: true
    };
  },
  computed: {
    isLoading() {
      return { display: this.loading ? "none" : null };
    }
  },
  template: `
  <div :class="{ loading }">
    <i v-if="loading && src" class="loader fas fa-spinner"></i>
    <img v-if="src" :src="src" :style="isLoading" @load="loading = false"></img>
  </div>`
});

Vue.component("approved", {
  functional: true,
  render: (el, _) =>
    el("i", {
      class: "fas fa-star",
      attrs: {
        title: "\"A Gold award I guess? aneyo likes this skin, cool shit\""
      },
      style: "color: gold"
    })
});
