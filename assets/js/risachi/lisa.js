Vue.component("skin", {
  props: ["data", "selected", "index"],
  template: `
  <div class="skin">
    <preview
      :thumbnail="data.thumbnail"
      :album="data.img"
      :video="data.v"
      :large="selected"
      :nsfw="data.nsfw"
      :id="data.id"
      />
    <div info-block>
      <div meta>
        <a meta-name :href="'#'+data.id" @click="$emit('select', data.id)">{{data.name}}</a>
        <div meta-tags>
          <span class="nsfw tag" v-if="data.nsfw"></span>
          <span :class="[data.mod?'modded':'original','tag']"></span>
        </div>
        <div meta-author>by <a class="author-link" :href="data.alink">{{data.author}}</a></div>
      </div>
      <div other>
        <a source-button :href="data.link" v-if="data.link"><i class="fas fa-book"></i></a>
        <a video-button :href="data.v" v-if="data.v"><i class="fab fa-youtube"></i></a>
      </div>
    </div>
    <div download-button>
      <a :href="download_link" :download="download_name"><i class="fas fa-download"></i></a>
    </div>
  </div>`,
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
    if (this.selected)
      this.$nextTick(_ =>
        setTimeout(
          _ =>
            (this.$el.ownerDocument.documentElement.scrollTop =
              this.index * 81),
          100
        )
      );
  }
});

Vue.component("preview", {
  props: ["thumbnail", "album", "video", "large", "nsfw", "id"],
  template: `
  <div class="preview" :class="{nsfw}">
    <div class="album-controls" v-if="large && album && album.length > 0">
      <a album-control href="#" @click.prevent="swipe(-1)"><i class="fas fa-angle-left"></i></a>
      <a album-control href="#" @click.prevent="swipe(1)"><i class="fas fa-angle-right"></i></a>
    </div>
    <div class="lazy-album" v-if="large" ref="album">
      <lazy class="album-image" :src="image" :key="image" v-for="image in album"></lazy>
    </div>
    <lazy class="lazy-preview" :src="thumbnail" v-else/>
  </div>`,
  methods: {
    swipe(index) {
      this.$refs["album"].scroll(
        this.$refs["album"].scrollLeft + this.$el.offsetWidth * index,
        0
      );
    }
  }
});

Vue.component("lazy", {
  props: ["src"],
  data() {
    return {
      loading: true
    };
  },
  template: `
  <div :class="{loading}">
    <i class="loader fas fa-spinner" v-if="loading && src"></i>
    <img :src="src" @load="onLoad" :style="{ display: loading ? 'none':null }" v-if="src"/>
  </div>`,
  methods: {
    onLoad() {
      this.loading = false;
    }
  }
});
