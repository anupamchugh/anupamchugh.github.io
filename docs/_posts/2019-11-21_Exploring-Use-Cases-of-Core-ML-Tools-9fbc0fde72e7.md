---
title: Exploring Use Cases of Core ML Tools
description: "Evaluation, transformations, updatable models, and\_more"
date: '2019-11-21T15:04:45.590Z'
categories: []
keywords: []
slug: /@anupamchugh/exploring-use-cases-of-core-ml-tools-9fbc0fde72e7
---

![](/Users/anupamchugh/Downloads/medium-export-a4b48d5fe977f1f289836fecb566e574d085c11debefe6da1b475ac0c8622324/posts/md_1703150257140/img/0__7vnYpILSk4MraEXB.jpg)

Apple’s Core ML is a powerful machine learning framework with an easy-to-use drag-and-drop interface. And the latest iteration, [Core ML 3](https://heartbeat.comet.ml/whats-new-in-core-ml-3-d108d352e50a), brought in lots of new layers and gave rise to [updatable models](https://medium.com/better-programming/how-to-create-updatable-models-using-core-ml-3-cc7decd517d5).

With the release of so many features, one thing that often gets sidelined is the things you can do with a model outside of Xcode. There’s a lot of functionality for fine-tuning, customizations, and model testing even before you deploy a Core ML model in your applications.

Using the `coremltools` Python package, you can not only convert models but also use the utility classes for debugging layers, modifying feature shapes, setting hyperparameters, and even running predictions.

With the advent of `coremltools 3.0`, around 100 more layers have been, in comparison to Core ML 2. Also, it’s now possible to mark layers as updatable to allow for on-device training.

In the following sections, we’ll be walking through the different use cases and scenarios where `coremltools` is handy for us and our ML model.

Before we get started, go ahead and install `coremltools 3.0` using the following command:

pip install -U coremltools

### Preprocessing and Model Conversion

Core ML Tools provides converters to convert models from popular machine learning libraries such as Keras, Caffe, scikit-learn, LIBSVM, and XGBoost to Core ML.

Additionally, [onnx-coreml](https://github.com/onnx/onnx-coreml) and [tf-coreml](https://github.com/tf-coreml/tf-coreml) neural network converters are built on top of `coremltools`.

`tf-coreml` requires setting a minimum deployment target flag in the `convert` function. This is because the under-the-hood implementation for iOS 13 deployed models is different from the older versions.

For iOS 13 and above, node names need to be passed—instead of tensor shapes—in the parameter `input_name_shape_dict`.

The following code snippet showcases how to convert a Keras model to Core ML:

Using the Python script shown above, we can do a variety of things, such as changing input and output names, preprocessing, etc.

The `image_input_names` argument indicates that the input type can be considered as an image. Otherwise, by default, inputs are created as multi-dimensional arrays by Core ML.

`image_scale` is used to specify the values by which the input is scaled. The pixels get multiplied by that number. This argument is applicable only if `image_input_names` was set.

`red_bias`, `green_bias`, `blue_bias`, and `gray_bias`: These values add the R, G, B, or grayscale color values to the pixels.

For classifier models, we can pass an argument `class_labels` with an array or file containing the class labels, which are mapped to the neural network’s output indexes.

### Modifying Input and Output Types

For cases, where you have a Core ML model in hand, but not in the desired input constraints, `coremltools` is a handy utility. It not only allows resizing the input and output, but it also lets you change the types. For example, if you need to convert an input type that’s `MLMultiArray` to an image type with a certain color space, the following piece of code does that for you:

```
import coremltoolsimport coremltools.proto.FeatureTypes_pb2 as ft spec = coremltools.utils.load_spec("OldModel.mlmodel")input = spec.description.input[0]input.type.imageType.colorSpace = ft.ImageFeatureType.RGBinput.type.imageType.height = 224 input.type.imageType.width = 224coremltools.utils.save_spec(spec, "NewModel.mlmodel")
```

> Using `flexible_shape_utils` from `coremltools`, we can further specify shape ranges or even set multiple input and output shapes.

### Quantization

Application sizes matter a lot, and certain Core ML models can take up huge chunks of storage space. Quantization works to reduce model size without any significant loss of accuracy. When reducing the size of the model, we lower the precision of weights.

The following code shows one such example of quantizing a Core ML model.

from coremltools.models.neural\_network.quantization\_utils import quantize\_weights  
  
model = coremltools.models.MLModel('model.mlmodel')  
quantized\_model = quantize\_weights(model, nbits=8, quantization\_mode="linear")

Some of the quantization modes which are currently supported are `linear` ,`kmeans` ,`linear_symmetric`, and `linear_lut` .

Currently, Caffe and Keras converters support full precision and half precision quantization. This can be set in the `model_precision` argument in the converter functions. It defaults to `float32` .

### Modifying Layers

Core ML Tools allows us to inspect, add, delete, or modify layers. For layers that `coremltools` can’t convert, it allows us to set a placeholder layer by setting the argument `add_custom_layers` to `true` in the convert function:

```
coreml_model = keras_converter.convert(keras_model, add_custom_layers=True)
```

Also, we can inspect a number of layers by invoking `inspect_layers` on the Neural Network Builder instance.

spec = coremltools.utils.load\_spec(MyModel.mlmodel) builder=coremltools.models.neural\_network.NeuralNetworkBuilder(spec=spec)  
builder.inspect\_layers(last=2)  
builder.inspect\_input\_features()

The following code shows examples of adding or removing layers from the builder specs:

new\_layer = neuralNetworkClassifier.layers.add()  
new\_layer.name = 'my\_new\_layer'

//delete  
del nn.layers\[-1\]

> In order to delete a range of layers, you can use `layers[a:b]`

### Allowing On-Device Model Training

On-device model training is one of the biggest advancements in Core ML 3. It allows us to personalize models from the device itself, without having to retrain server-side. In order to allow ML models to be updated on the device, we need to:

*   Mark certain layers as updatable
*   Set the loss functions and hyperparameters
*   Add training inputs specs in the builder specifications.

In another scenario, you can pass the `respect_trainable=True` argument to `coremltools.converters.keras.convert()` during model conversion, if you wish to build directly updatable Core ML models instead of modifying them later.

Currently, only neural networks and KNN models can be made updatable using `coremltools` .

builder.make\_updatable(\['layer\_name\_1', 'layer\_name\_2'\])  
  

model\_spec.description.trainingInput\[0\].shortDescription = 'Image for training and updating the model'  
model\_spec.description.trainingInput\[1\].shortDescription = 'Set the class label here'

Also, we need to set the hyperparameters such as epochs, [learning rates](https://heartbeat.comet.ml/introduction-to-learning-rates-in-machine-learning-6ed685c16506), and batch size of training samples for the updatable models, as shown below:

builder.set\_sgd\_optimizer(SgdParams(lr=0.01, batch=12))  
builder.set\_epochs(20)  
builder.set\_categorical\_cross\_entropy\_loss(name='lossLayer', input='output')

Loss functions inside models are just like layers. Currently, `binary_entropy` and `categorical_cross_entropy` (for more than label classes) are among the few loss functions that are supported.

Finally, you need to set the `isUpdatable` flag on the model specification alongside the minimum specification version (Core ML has v4), as shown below:

model\_spec.isUpdatable = True  
model\_spec.specificationVersion = coremltools.\_MINIMUM\_UPDATABLE\_SPEC\_VERSION

> Note: Besides SGD, you can also use Adam optimizers.

### Run Predictions

It’s easy to run predictions from the `coremltools` Python script itself. To start, you need to load your `.mlmodel` using `coremltools` .

The following code loads an image classification `.mlmodel` and runs predictions on it:

import coremltools  
import PIL.Image

def load\_image(path, resize\_to=None):  
    # resize\_to: (Width, Height)  
    img = PIL.Image.open(path)  
    if resize\_to is not None:  
        img = img.resize(resize\_to, PIL.Image.ANTIALIAS)  
    return img

model = coremltools.models.MLModel('catDogModel.mlmodel')  
img = load\_image('./test-image.jpeg', resize\_to=(150, 150))

result = model.predict({'image': img})  
print(result)

In the above code, we pass the model name in the `.mlmodel` class constructor. Optionally, you can restrict the model to run on CPU only by setting the boolean argument `useCPUOnly=True` in the constructor.

Next, we load the image using `PIL`(pillow package) into our [custom-made Core ML Model](https://github.com/anupamchugh/iowncode/blob/master/iOSCoreMLOnDeviceTraining/iOSCoreMLTrainModelOnDevice/iOSCoreMLTrainModelOnDevice/CatDogUpdatable.mlmodel) and resize it to fit the input constraints (150x150 for this model).

We ran the above Python script using the following image and got the output as a `cat` (exact output is available in image caption).

![](/Users/anupamchugh/Downloads/medium-export-a4b48d5fe977f1f289836fecb566e574d085c11debefe6da1b475ac0c8622324/posts/md_1703150257140/img/1__v__BbWD0l6O75efEp__rf7aw.jpeg)

Besides testing your model’s accuracy as we did above, you can also debug your model layers and print out the specs, a summary, or you can visualize your model by invoking `visualize_spec()` on the `.mlmodel`.

### Conclusion

Core ML 3 brings in lots of new control flow layers that can give rise to building different neural network Core ML models programmatically using the Neural Network Builders. Here’s an [example](https://github.com/apple/coremltools/blob/master/examples/neural_network_inference/Neural_network_control_flow_power_iteration.ipynb) of that right from the docs.

Also, the new release of `coremltools` brings in support for TensorFlow 2.0 converters as well. Moving forward, you can try adding activation layers to models, quantize, and evaluate models before you deploy them in your applications.

That wraps up this piece. I hope you enjoyed reading.