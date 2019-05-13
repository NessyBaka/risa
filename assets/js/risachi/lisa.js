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
    download_link() {
      return (
        this.data.download ||
        "https://aneyo.github.io/risa/s/" + this.data.id + ".osk"
      );
    },
    download_name() {
      return (this.data.id || "skin.risa") + ".osk";
    }
  },
  mounted() {
    if (this.selected) this.$nextTick(() => setTimeout(this.scrollTo, 100));
  },
  methods: {
    scrollTo() {
      this.$el.ownerDocument.documentElement.scrollTop = this.index * 81;
    },
    select() {
      this.$emit("select", this.data.id);
    }
  },
  template: `
  <div class="skin">
    <preview-widget
      :thumbnail="data.thumbnail"
      :album="data.img"
      :video="data.v"
      :large="selected"
      :nsfw="data.nsfw"
      :id="data.id"
    ></preview-widget>
    <div class="info-block">
      <div class="meta">
        <a class="meta-name" :href="'#'+data.id" @click.prevent="select">{{data.name}} <approved v-if="data.approve"></approved></a>
        <div class="meta-tags">
          <span class="nsfw tag" v-if="data.nsfw"></span>
          <span :class="[data.mod?'modded':'original','tag']"></span>
        </div>
        <div class="meta-author">
          by
          <a class="author-link" target="_blank" rel="noreferrer" :href="data.alink" >{{data.author}}</a>
        </div>
      </div>
      <div class="other">
        <a class="source-button" target="_blank" rel="noreferrer" :href="data.link" v-if="data.link">
          <i class="fas fa-book"></i>
        </a>
        <a class="video-button" target="_blank" rel="noreferrer" :href="data.v" v-if="data.v">
          <i class="fab fa-youtube"></i>
        </a>
      </div>
    </div>
    <div class="download-button">
      <a :href="download_link" :download="download_name">
        <i class="fas fa-download"></i>
      </a>
    </div>
  </div>`
});

Vue.component("preview-widget", {
  props: {
    thumbnail: String,
    album: Array,
    video: String,

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
    hasImages() {
      return this.album && this.album.length > 0;
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
      <lazy v-for="image in album" :key="image" class="album-image" :src="image"></lazy>
    </div>
    <lazy v-else-if="thumbnail" key="small-preview" class="lazy-preview" :src="thumbnail"></lazy>
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
      class: "fas fa-medal",
      attrs: {
        title: "Approved by aneyo, idk if you should trust him"
      },
      style: "color: gold"
    })
});
