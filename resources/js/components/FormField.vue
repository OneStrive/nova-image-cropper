<template>
    <DefaultField
        :field="field"
        :errors="errors"
        :full-width-content="true"
        :show-help-text="false"
    >
        <template #field>
            <ImageViewer
                @image-deleted="imageDeleted"
                v-show="!imgSrc"
                :field="field"
                :resourceId="resourceId"
                :resourceName="resourceName"
                :relatedResourceId="relatedResourceId"
                :relatedResourceName="relatedResourceName"
                :viaRelationship="viaRelationship"
            ></ImageViewer>

            <img v-if="imgSrc && skipCrop" :src="imgSrc" class="mb-4 max-w-full rounded" style="max-height: 300px;" />

            <VueCropper
                v-if="field.croppable"
                v-show="imgSrc && !skipCrop"
                class="mb-4"
                ref="cropper"
                :view-mode="1"
                :aspect-ratio="field.aspectRatio || NaN"
                :src="imgSrc"
                @cropend="onCropEnd"
                @ready="onCropReady"
            ></VueCropper>

            <p v-if="imgSrc && field.croppable && field.minWidth && field.minHeight && cropWidth && cropHeight && !skipCrop" class="text-sm mb-3" :class="cropDimensionsValid ? 'text-green-500' : 'text-red-500'">
                Crop area: {{ cropWidth }}×{{ cropHeight }}px
            </p>

            <p v-if="imgSrc" class="mt-3 mb-6 flex items-center text-sm">
                <OutlineButton type="button" @click="cancel">
                    <span class="">
                        {{ __("Cancel") }}
                    </span>
                </OutlineButton>
            </p>

            <span class="form-file mr-4">
                <input
                    ref="fileField"
                    :dusk="field.attribute"
                    class="form-file-input"
                    type="file"
                    :id="idAttr"
                    name="name"
                    :accept="field.acceptedTypes"
                    @change="fileChange"
                />
                <label
                    :for="labelFor"
                    class="shadow relative bg-primary-500 hover:bg-primary-400 active:bg-primary-600 text-white dark:text-gray-900 cursor-pointer rounded text-sm font-bold focus:outline-none focus:ring inline-flex items-center justify-center h-9 px-3 shadow relative bg-primary-500 hover:bg-primary-400 active:bg-primary-600 text-white dark:text-gray-900"
                >
                    {{ imgSrc ? __("Change File") : __("Choose File") }}
                </label>
            </span>
            <span class="text-gray-50">
                {{ currentLabel }}
            </span>

            <p v-if="field.helpText" class="mt-2 text-xs" :class="(imageSizeError || (!skipCrop && !cropDimensionsValid)) ? 'text-red-500' : 'text-gray-400'">
                {{ field.helpText }}
                <span v-if="imageSizeError"> ({{ imageSizeError }})</span>
            </p>

            <p v-if="hasError" class="text-xs mt-2 text-danger">
                {{ firstError }}
            </p>
        </template>
    </DefaultField>
</template>

<script>
    import "cropperjs/dist/cropper.css";
    import VueCropper from "vue-cropperjs";
    import { FormField, HandlesValidationErrors, Errors } from "laravel-nova";

    import Button from "@/components/Button/Button";
    import ImageViewer from "@/components/Image/ImageViewer";

    export default {
        props: [
            "field",
            "resourceId",
            "resourceName",
            "relatedResourceId",
            "relatedResourceName",
            "viaRelationship",
        ],

        mixins: [HandlesValidationErrors, FormField],

        components: { VueCropper, Button, ImageViewer },

        data: () => ({
            imgSrc: "",
            file: null,
            fileName: "",
            uploadErrors: new Errors(),
            cropWidth: null,
            cropHeight: null,
            actualWidth: null,
            actualHeight: null,
            skipCrop: false,
            imageSizeError: null,
        }),

        methods: {
            /**
             * Fill the attributes on form submit
             */
            fill(formData) {
                if (this.file) {
                    if (this.field.croppable && this.field.minWidth && this.field.minHeight && !this.skipCrop && !this.cropDimensionsValid) {
                        Nova.$toasted.show(
                            `Crop area (${this.cropWidth}×${this.cropHeight}px) is too small. It must be at least ${this.field.minWidth}×${this.field.minHeight}px.`,
                            { type: 'error', duration: 4000 }
                        );
                        throw new Error('crop-dimensions-invalid');
                    }
                    formData.append(
                        this.field.attribute,
                        this.file,
                        this.fileName
                    );
                    if (this.field.croppable) {
                        const cropData = this.skipCrop
                            ? { x: 0, y: 0, width: this.actualWidth || 0, height: this.actualHeight || 0 }
                            : this.$refs.cropper.getData(true);
                        formData.append(
                            this.field.attribute + "_data",
                            JSON.stringify(cropData)
                        );
                    }
                }
            },

            /**
             * Cancel the new selected image
             */
            cancel() {
                if (this.field.croppable) {
                    this.$refs.cropper.destroy();
                }
                this.imgSrc = "";
                this.file = null;
                this.fileName = "";
                this.cropWidth = null;
                this.cropHeight = null;
                this.actualWidth = null;
                this.actualHeight = null;
                this.skipCrop = false;
                this.imageSizeError = null;
            },

            /**
             * Respond to the file change
             * Set the data and init the crop box if the image is croppable
             */
            fileChange(e) {
                let path = e.target.value;
                let fileName = path.match(/[^\\/]*$/)[0];
                this.fileName = fileName;
                this.file = this.$refs.fileField.files[0];

                const file = e.target.files[0];
                if (!file.type.includes("image/")) {
                    alert(this.__("Please select an image file"));
                    return;
                }

                this.skipCrop = false;
                this.cropWidth = null;
                this.cropHeight = null;
                this.imageSizeError = null;

                if (this.field.croppable) {
                    if (typeof FileReader === "function") {
                        const reader = new FileReader();
                        reader.onload = (event) => {
                            const dataUrl = event.target.result;
                            const minW = this.field.minWidth || 0;
                            const minH = this.field.minHeight || 0;
                            if (minW && minH) {
                                createImageBitmap(file).then((bitmap) => {
                                    const w = bitmap.width;
                                    const h = bitmap.height;
                                    bitmap.close();
                                    this.actualWidth = w;
                                    this.actualHeight = h;
                                    if (w < minW || h < minH) {
                                        this.imageSizeError = `${w}×${h}px`;
                                        this.skipCrop = true;
                                    } else {
                                        this.imageSizeError = null;
                                        this.skipCrop = w === minW && h === minH;
                                    }
                                    this.imgSrc = dataUrl;
                                    this.$refs.cropper.replace(dataUrl);
                                });
                            } else {
                                this.imgSrc = dataUrl;
                                this.$refs.cropper.replace(dataUrl);
                            }
                        };
                        reader.readAsDataURL(file);
                    } else {
                        alert(this.__("Sorry, FileReader API not supported"));
                    }
                }
            },

            onCropEnd() {
                this.updateCropDimensions();
            },

            onCropReady() {
                this.updateCropDimensions();
            },

            updateCropDimensions() {
                if (this.$refs.cropper) {
                    const data = this.$refs.cropper.getData(true);
                    this.cropWidth = data.width;
                    this.cropHeight = data.height;
                }
            },

            /**
             * Inform the parent component that the file has been deleted
             * This event allows to update the `lastRetrievedAt` timestamp for further model changes
             */
            imageDeleted() {
                this.$emit("file-deleted");
            },
        },

        computed: {
            /**
             * Determine whether the image field has errors
             */
            hasError() {
                return this.uploadErrors.has(this.fieldAttribute);
            },

            /**
             * The first error, if any, of the image field
             */
            firstError() {
                if (this.hasError) {
                    return this.uploadErrors.first(this.fieldAttribute);
                }
            },

            /**
             * The current label of the image field
             */
            currentLabel() {
                return this.fileName || this.__("no file selected");
            },

            /**
             * The ID attribute to use for the image field
             */
            idAttr() {
                return this.labelFor;
            },

            /**
             * The label attribute to use for the image field
             */
            labelFor() {
                return `advanced-image-${this.field.attribute}`;
            },

            cropDimensionsValid() {
                if (!this.cropWidth || !this.cropHeight) {
                    return true;
                }
                const minWidth = this.field.minWidth || 0;
                const minHeight = this.field.minHeight || 0;
                return this.cropWidth >= minWidth && this.cropHeight >= minHeight;
            },
        },
    };
</script>
