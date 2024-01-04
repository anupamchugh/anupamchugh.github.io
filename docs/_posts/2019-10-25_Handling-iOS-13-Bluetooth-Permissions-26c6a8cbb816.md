---
title: Handling iOS 13 Bluetooth Permissions
description: Need to access CoreBluetooth? Ask the user first.
date: '2019-10-25T11:57:40.000Z'
categories: []
keywords: []
slug: /@anupamchugh/handling-ios-13-bluetooth-permissions-26c6a8cbb816
---

![](/Users/anupamchugh/Downloads/medium-export-a4b48d5fe977f1f289836fecb566e574d085c11debefe6da1b475ac0c8622324/posts/md_1703150257140/img/0__N2dJOe6__hNHnckBw.jpg)

Core Bluetooth framework is an abstraction layer that provides developers access to BLE hardware. Apple introduced quite a few changes for the better during WWDC 2019. Besides fast transfer and power-efficient connections, much emphasis has been given to user privacy.

Until iOS 12, applications could access Bluetooth without the user’s knowledge. This could be done for good reasons, such as connecting to Chromecast or wireless headsets.

But this had it’s own pitfalls and created a hole in the user’s privacy. Developers could take advantage of this and track things like location data.

Starting iOS 13, if your application uses any of the Core Bluetooth APIs it requires the user’s permission. And off course, they can change it from settings!

![](/Users/anupamchugh/Downloads/medium-export-a4b48d5fe977f1f289836fecb566e574d085c11debefe6da1b475ac0c8622324/posts/md_1703150257140/img/1__nwb6Z4a1dOREtvdQIvUEEw.png)

> If you’ve upgraded your device to iOS 13, I’m sure you’d have seen the above prompt plenty of times!

> It brings to light the number of applications that had been using bluetooth so far.

### Privacy Permissions And Usage Descriptions

Starting iOS 13, it’s mandatory for developers to specify the Privacy Usage Description for Bluetooth by including `NSBluetoothAlwaysUsageDescription` in their `info.plist` file. Accessing Core Bluetooth without the usage descriptions would lead to a runtime crash.

For backward support for older iOS versions, `NSBluetoothPeripheralUsageDescription` needs to be defined as well.

![](/Users/anupamchugh/Downloads/medium-export-a4b48d5fe977f1f289836fecb566e574d085c11debefe6da1b475ac0c8622324/posts/md_1703150257140/img/0__BHvwbNzxDb2cC7el.png)

### API changes

`CBManagerAuthorisation` is a newly added property is iOS 13. It’s used to determine the authorization status of Bluetooth permission.

The `authorization` property can have any of the following states:

*   `allowedAlways`
*   `restricted`
*   `notDetermined`
*   `denied`

In the next section, we’ll be discussing the various steps you need to follow in order to integrate CoreBluetooth in your application.

### Implementation

`import CoreBluetooth` in order to use the Core Bluetooth Framework in your codebase.

For using the Core Bluetooth functionalities, we need to implement `CBPeripheralDelegate` and `CBCentralManagerDelegate` protocols.

#### Initialize the Bluetooth Manager

`CBCentralManager` is responsible for scanning and connecting to devices. Once the connection is done, the `CBPeripheral` takes charge of the proceedings.

var centralManager: CBCentralManager?  
var peripheral: CBPeripheral?  
      
override func viewDidLoad() {  
    super.viewDidLoad()  
    centralManager = CBCentralManager(delegate: self, queue: nil)   
}

Right when the `CentralManager` is initialized, the `centralManagerDidUpdateState(_central: CBCentralManager)` delegate method is triggered to check the state of the Bluetooth connection.

> If the bluetooth is turned off, CBCentralManager can’t be instantiated and the system will automatically throw a dialog prompt asking you to enable it.

![](/Users/anupamchugh/Downloads/medium-export-a4b48d5fe977f1f289836fecb566e574d085c11debefe6da1b475ac0c8622324/posts/md_1703150257140/img/1__p7GPSc7KPKg3PzwalsaK5g.jpeg)

We can check the user authorization status using the `central.state.authorization` property.

func centralManagerDidUpdateState(\_ central: CBCentralManager) {  
           switch central.state {  
           case .unauthorized:  
               switch central.authorization {  
               case .allowedAlways:  
               case .denied:  
               case .restricted:  
               case .notDetermined:  
           }  
           case .unknown:  
           case .unsupported:  
           case .poweredOn:  
               self.centralManager?.scanForPeripherals(withServices: nil, options: \[CBCentralManagerScanOptionAllowDuplicatesKey:true\])  
           case .poweredOff:  
           case .resetting:  
           @unknown default:  
           }  
 }

Scanning of devices is only possible when the state changes to `poweredOn`

> Note: Core Bluetooth scans for BLE devices only.

#### Connecting To Scanned Devices

Once a BLE device is discovered it shows up in the below method:

func centralManager(\_ central: CBCentralManager, didDiscover peripheral: CBPeripheral, advertisementData: \[String : Any\], rssi RSSI: NSNumber) {  
  
        self.peripheral = peripheral  
        self.peripheral?.delegate = self  
          
        centralManager?.connect(peripheral, options: nil)  
        centralManager?.stopScan()  
 }

We can then access the Bluetooth Device name from the `peripheral.name` property.

From here the `CBPeripheralDelegate` takes control. We can leverage its delegate method to get notified of the characteristics of peripheral devices.

We can also do stuff such as passing data using the `writeValue` function on the peripheral instance. The positive thing is that the user is aware!

### Conclusion

Apple strives to provide transparency and improve user experience by bumping up Bluetooth security through the new iOS 13 permissions.  
That’s it for this one. I hope you enjoyed it.