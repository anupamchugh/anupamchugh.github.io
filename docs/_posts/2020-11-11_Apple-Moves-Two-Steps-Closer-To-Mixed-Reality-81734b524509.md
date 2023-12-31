---
title: Apple Moves Two Steps Closer To Mixed Reality
description: >-
  As the world awaits Apple Glass, the Cupertino tech giant has been quietly
  laying a foundation
date: '2020-11-11T13:41:01.049Z'
categories: []
keywords: []
slug: /@anupamchugh/apple-moves-two-inches-closer-towards-mixed-reality-81734b524509
---

![](/Users/anupamchugh/Downloads/medium-export-a4b48d5fe977f1f289836fecb566e574d085c11debefe6da1b475ac0c8622324/posts/md_1703150257140/img/1__dyYsj2q5N__vqUnQA9v3tfA.jpeg)

Now that the euphoria and dust of the iPhone 12 has settled, it’ll be nice to shift our focus towards the future. Unless you’ve been living under a rock, you probably know about Apple Glass.

Touted as the next big thing after iPhone, Apple is tight-lipped about their much-awaited and highly ambitious wearable headset project. The product, which was once expected to be released in 2020, has been pushed back by at least a year, if not more.

Much of the delay has been attributed to design issues. But given the lukewarm response augmented reality has received till now, it would be rather harsh to criticize Apple for holding back their next big innovation. After all, for a mixed reality device to achieve success, there needs to be a well-thought-out strategy in place. Getting everyday people to wear smart glasses and interact with them like they do with their smartphone isn’t a cakewalk and requires a complete paradigm shift, which doesn’t happen overnight.

Besides, for a product to achieve widespread adoption, there needs to be a mature ecosystem of third-party AR apps and this requires getting developers on board and excited for the AR app development in the first place. So, there are quite a few barriers that Apple needs to address which explains their slow and cautious progress with the much anticipated Apple Glass.

Now, Apple had made huge strides in augmented reality during 2019 by introducing the RealityKit and RealityComposer frameworks for developers. Unlike ARKit which requires a good knowledge of SceneKit, the RealityKit framework boasts a high-level 3D engine and makes setting up AR environments a much easier task. Coupled with RealityComposer, you could quickly build 3D scenes with minimal code.

Yet it was only after WWDC 2020 this year when Apple gave a sneak peek into their plans with mixed reality and how AR Glass might shape up in their ecosystem.

### AirPod Pro’s Spatial Audio Is Apple’s First Big Step Towards Mixed Reality

During WWDC 2020, Apple released an exciting new update for AirPod Pro with iOS 14 in the form of spatial awareness. Spatial audio essentially recreates the listening experience in such a way that it feels like the sound is coming directly from the source device rather than your headphones.

To do so, spatial audio does a dynamic head-tracking using a gyroscope and accelerometer while also tracking the location of your iOS device. Together with this data, it creates audio filters and rehashes frequencies to simulate a home theatre-like surround sound experience.

Take a look at this [demonstration](https://twitter.com/ConcreteSciFi/status/1310451660842385411) (below) that shows the new spatial audio and how AirPods can now help track your head by using `CMHeadphoneMotionManager` API:

Now, from a distance, this might seem like a feature for providing an immersive sound experience. But as soon as you integrate this with the ARKit framework, it’s a total game-changer.

By leveraging the head motion data, you can start interacting with virtual objects around you. This isn’t a small feat by any means as, unlike previously, you’re no longer constrained to hold your phone out in front of you while interacting with virtual objects in space.

Imagine, how easy would it be to play Pokemon Go. Finding objects by visual cues simply by moving your head with respect to the source of the sound. Or integrating it with Street View to determine what you’re looking at.

Augmented reality has long suffered due to its lack of immersive experience as you’re only interacting with overlayed objects on your phone. The new head-tracking feature of AirPods would nicely integrate with Apple Glass and through its spatial awareness bring us a step closer to mixed reality. Users would finally be able to interact with digital projections and holograms through gestures.

### The LiDAR Scanner Will Help Project Augmented Images In Front Of Our Eyes

When the possibilities of Apple Glass first emerged on the scene, it created a scary picture in the minds of many people. Having a camera on the wearable glass opens the door for privacy issues as people could start recording. This can be a nightmare for those who’ve watched _Black Mirror_.

Thankfully, Apple Glass won’t be shipping with a camera. But that didn’t bar Apple from enhancing their AR lens experience. To ensure Apple Glass isn’t just a smartwatch on your face, Apple will include a LiDAR scanner.

LiDAR, which stands for “Light Detection and Ranging” is a technology that’s at the heart of driverless cars. Apple unveiled this sensor in their latest iPad Air and iPhone 12 Pro this year. Brought in to boost computational photography through faster auto-focus, especially in low-light, the LiDAR sensor opens the door for even bigger possibilities in augmented reality.

For starters, it significantly reduces the amount of time needed for scanning surfaces to place virtual objects. LiDAR helps quickly generate 3D prototypes and meshes from the surveyed environment in real-time. This can help mapping data on the Apple Glass for things like map navigation directions or touchless keyboard typing. Helping visually impaired people through audio cues about the environment is also one of the striking capabilities LiDAR brings to the table.

Another aspect of LiDAR that’ll boost Apple Glass is the ability to augment lighting conditions in the dark.

Though LiDAR requires significant computation power, which would obviously impact the battery life, Apple will possibly offload most of the processing to your connected iPhone. Besides, Apple’s recent acquisition of [NextVR](https://medium.com/big-tech/the-future-of-watching-films-and-sports-is-through-virtual-reality-edf192e7711e) will certainly help them upscale video streaming content displayed on the Apple Glass.

To give developers a chance to play and adopt the LiDAR technology, Apple has introduced a new depth API and enhanced scene geometry in the ARKit framework. At the same time, they’ve bolstered object occlusion rendering and location anchoring in the RealityKit framework this year.

### Conclusion

The world has long been waiting for breakthrough innovations in design and technology from Apple. But given the failure of Google Glass, one understands why Apple is in no mood to rush with their next big thing.

Apple Glass won’t survive as a standalone product unless it has an ecosystem in place and to ensure that it’s a success, Apple has made significant strides this year. Be it through spatial awareness in AirPod Pro or with the all-new LiDAR sensor. Both of these would play a significant role in shaping up the immersive experience of Apple Glass.

That’s it for this one, thanks for reading.

_Editor’s Note:_ [_Heartbeat_](https://heartbeat.comet.ml/) _is a contributor-driven online publication and community dedicated to providing premier educational resources for data science, machine learning, and deep learning practitioners. We’re committed to supporting and inspiring developers and engineers from all walks of life._

_Editorially independent, Heartbeat is sponsored and published by_ [_Comet_](http://comet.ml/?utm_campaign=heartbeat-statement&utm_source=blog&utm_medium=medium)_, an MLOps platform that enables data scientists & ML teams to track, compare, explain, & optimize their experiments. We pay our contributors, and we don’t sell ads._

_If you’d like to contribute, head on over to our_ [_call for contributors_](https://heartbeat.fritz.ai/call-for-contributors-october-2018-update-fee7f5b80f3e)_. You can also sign up to receive our weekly newsletters (_[_Deep Learning Weekly_](https://www.deeplearningweekly.com/) _and the_ [_Comet Newsletter_](https://info.comet.ml/newsletter-signup/)_), join us on_ [](https://join.slack.com/t/fritz-ai-community/shared_invite/enQtNTY5NDM2MTQwMTgwLWU4ZDEwNTAxYWE2YjIxZDllMTcxMWE4MGFhNDk5Y2QwNTcxYzEyNWZmZWEwMzE4NTFkOWY2NTM0OGQwYjM5Y2U)[_Slack_](https://join.slack.com/t/cometml/shared_invite/zt-49v4zxxz-qHcTeyrMEzqZc5lQb9hgvw)_, and follow Comet on_ [_Twitter_](https://twitter.com/Cometml) _and_ [_LinkedIn_](https://www.linkedin.com/company/comet-ml/) _for resources, events, and much more that will help you build better ML models, faster._