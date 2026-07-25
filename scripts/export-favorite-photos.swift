#!/usr/bin/env swift

import AppKit
import Foundation
import Photos

// Explicit bridge from Apple Photos to the blog.
// Only Favorites are exported. Nothing is published or written back to Photos.
// Usage: swift scripts/export-favorite-photos.swift [output-dir]

let outputPath = CommandLine.arguments.dropFirst().first
    ?? FileManager.default.currentDirectoryPath + "/.photo-review/inbox"
let outputURL = URL(fileURLWithPath: outputPath, isDirectory: true)
let fm = FileManager.default
try fm.createDirectory(at: outputURL, withIntermediateDirectories: true)

let semaphore = DispatchSemaphore(value: 0)
var exitCode: Int32 = 0

PHPhotoLibrary.requestAuthorization(for: .readWrite) { status in
    guard status == .authorized || status == .limited else {
        fputs("Photos access is required. Nothing was exported.\n", stderr)
        exitCode = 1
        semaphore.signal()
        return
    }

    let options = PHFetchOptions()
    options.sortDescriptors = [NSSortDescriptor(key: "creationDate", ascending: false)]
    options.predicate = NSPredicate(format: "mediaType == %d AND isFavorite == YES", PHAssetMediaType.image.rawValue)
    let assets = PHAsset.fetchAssets(with: options)
    let manager = PHImageManager.default()
    let request = PHImageRequestOptions()
    request.isSynchronous = true
    request.isNetworkAccessAllowed = false
    request.deliveryMode = .highQualityFormat
    request.resizeMode = .resize

    struct ManifestItem: Codable {
        let filename: String
        let localIdentifier: String
        let date: String?
        let width: Int
        let height: Int
    }

    var manifest: [ManifestItem] = []
    let formatter = ISO8601DateFormatter()

    assets.enumerateObjects { asset, index, _ in
        var image: NSImage?
        manager.requestImage(
            for: asset,
            targetSize: NSSize(width: 2400, height: 2400),
            contentMode: .aspectFit,
            options: request
        ) { value, _ in image = value }

        guard let image, let tiff = image.tiffRepresentation,
              let bitmap = NSBitmapImageRep(data: tiff),
              let jpeg = bitmap.representation(using: .jpeg, properties: [.compressionFactor: 0.85]) else {
            print("skip (asset.localIdentifier): local image unavailable")
            return
        }

        let date = asset.creationDate.map(formatter.string)
        let datePart = date?.prefix(10) ?? "undated"
        let filename = String(format: "%02d-%@.jpg", index + 1, datePart)
        do {
            try jpeg.write(to: outputURL.appendingPathComponent(filename))
            manifest.append(.init(
                filename: filename,
                localIdentifier: asset.localIdentifier,
                date: date,
                width: asset.pixelWidth,
                height: asset.pixelHeight
            ))
        } catch {
            print("skip (filename): (error.localizedDescription)")
        }
    }

    do {
        let data = try JSONEncoder().encode(manifest)
        try data.write(to: outputURL.appendingPathComponent("manifest.json"))
        print("Exported (manifest.count) Favorites to (outputURL.path)")
        print("Review the inbox before moving anything into the public photo set.")
    } catch {
        fputs("Could not write manifest: \(error.localizedDescription)\n", stderr)
        exitCode = 1
    }
    semaphore.signal()
}

semaphore.wait()
exit(exitCode)
