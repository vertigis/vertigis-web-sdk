import Test, { TestModel } from "./components/Test";

const LAYOUT_NAMESPACE = "custom.foo";

export default function(registry) {
    registerComponents(registry);
    registerServices(registry);
    registerModels(registry);
}

function registerComponents(registry) {
    registry.registerComponent({
        name: "test",
        namespace: LAYOUT_NAMESPACE,
        getComponentType: () => Test,
        itemType: "test-model",
        title: "Test Component",
    });
}

function registerServices(registry) {}

function registerModels(registry) {
    registry.registerModel({
        getModelType: () => TestModel,
        itemType: "test-model",
    });
}
