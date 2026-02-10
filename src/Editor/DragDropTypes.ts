import { NativeTypes } from "react-dnd-html5-backend";

interface DragDropAssetProps {
  asset?: {
    classname?: string;
  };
}

interface DragDropOutlinerProps {
  data?: {
    classname?: string;
  };
}

export default {
  GET_ASSET_TYPE: (props: DragDropAssetProps) => {
    if (props.asset?.classname) return props.asset.classname;
    return "Asset";
  },
  CANVAS: [
    "ImageAsset",
    "ButtonAsset",
    "ClipAsset",
    "SVGAsset",
    NativeTypes.FILE,
  ], // TODO: Should take in all ids that canvas can receive.
  TIMELINE: ["SoundAsset"], // TODO: Should take in all ids that timeline can receive.
  GET_OUTLINER_SOURCE: (props: DragDropOutlinerProps) => {
    const classname = props.data?.classname?.toLowerCase?.();
    if (classname === "frame") {
      return "frame";
    } else if (classname === "layer") {
      return "layer";
    } else {
      return "object";
    }
  },
  GET_OUTLINER_TARGETS: (props: DragDropOutlinerProps) => {
    const classname = props.data?.classname?.toLowerCase?.();
    if (classname === "frame") {
      return ["object"];
    } else if (classname === "layer") {
      return ["object", "layer"];
    } else {
      return ["object"];
    }
  },
};
