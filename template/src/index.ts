import Test, { TestModel } from "./components/Test";

const LAYOUT_NAMESPACE = "custom.foo";

export default function(registry) {
    registry.registerComponent({
        name: "test",
        namespace: LAYOUT_NAMESPACE,
        getComponentType: () => Test,
        itemType: "test-model",
        title: "Test Component",
    });
    registry.registerModel({
        getModelType: () => TestModel,
        itemType: "test-model",
    });
}
