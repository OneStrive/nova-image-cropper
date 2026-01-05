import IndexField from "@/components/IndexField";
import DetailField from "@/components/DetailField";
import FormField from "@/components/FormField";

Nova.booting((Vue) => {
  Vue.component("index-nova-image-cropper", IndexField);
  Vue.component("detail-nova-image-cropper", DetailField);
  Vue.component("form-nova-image-cropper", FormField);
});
