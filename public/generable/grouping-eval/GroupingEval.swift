import Foundation
import FoundationModels

@Generable enum TopColor: String, Codable { case rust, black, white, blue, green, red }
@Generable enum TopStyle: String, Codable { case shirt, sweater, jacket, hoodie, blouse, tshirt }
@Generable enum ShoeColor: String, Codable { case black, white, brown, blue, red, green }
@Generable enum ShoeStyle: String, Codable { case boots, sneakers, sandals, loafers, heels, flats }
@Generable enum TattooDesign: String, Codable { case lion, rose, star, dragon, moon, bird }
@Generable enum TattooPlacement: String, Codable { case forearm, wrist, shoulder, ankle, back, hand }
@Generable struct FlatLook { var topColor: TopColor; var topStyle: TopStyle; var shoeColor: ShoeColor; var shoeStyle: ShoeStyle; var tattooDesign: TattooDesign; var tattooPlacement: TattooPlacement }
@Generable struct Top { var topColor: TopColor; var topStyle: TopStyle }
@Generable struct Shoes { var shoeColor: ShoeColor; var shoeStyle: ShoeStyle }
@Generable struct Tattoo { var tattooDesign: TattooDesign; var tattooPlacement: TattooPlacement }
@Generable struct MeaningfulLook { var top: Top; var shoes: Shoes; var tattoo: Tattoo }
@Generable struct MixedOne { var topColor: TopColor; var tattooDesign: TattooDesign }
@Generable struct MixedTwo { var shoeColor: ShoeColor; var tattooPlacement: TattooPlacement }
@Generable struct MixedThree { var topStyle: TopStyle; var shoeStyle: ShoeStyle }
@Generable struct MixedLook { var groupOne: MixedOne; var groupTwo: MixedTwo; var groupThree: MixedThree }
struct Values: Codable { let topColor: TopColor; let topStyle: TopStyle; let shoeColor: ShoeColor; let shoeStyle: ShoeStyle; let tattooDesign: TattooDesign; let tattooPlacement: TattooPlacement
 var strings: [String] { [topColor.rawValue,topStyle.rawValue,shoeColor.rawValue,shoeStyle.rawValue,tattooDesign.rawValue,tattooPlacement.rawValue] }
}
struct Case { let prompt: String; let key: Values }
let cases: [Case] = [
 Case(prompt:"A rust shirt, black boots, and a lion tattoo on the forearm.",key:Values(topColor:.rust,topStyle:.shirt,shoeColor:.black,shoeStyle:.boots,tattooDesign:.lion,tattooPlacement:.forearm)),
 Case(prompt:"Wear white sneakers with a blue sweater; place a rose on the wrist.",key:Values(topColor:.blue,topStyle:.sweater,shoeColor:.white,shoeStyle:.sneakers,tattooDesign:.rose,tattooPlacement:.wrist)),
 Case(prompt:"The tattoo is a star on the ankle. The shoes are brown sandals. The top is a green jacket.",key:Values(topColor:.green,topStyle:.jacket,shoeColor:.brown,shoeStyle:.sandals,tattooDesign:.star,tattooPlacement:.ankle)),
 Case(prompt:"For the shoulder, a dragon tattoo. Pair a black hoodie with red loafers.",key:Values(topColor:.black,topStyle:.hoodie,shoeColor:.red,shoeStyle:.loafers,tattooDesign:.dragon,tattooPlacement:.shoulder)),
 Case(prompt:"Choose a white blouse and blue heels; add a moon tattoo on the back.",key:Values(topColor:.white,topStyle:.blouse,shoeColor:.blue,shoeStyle:.heels,tattooDesign:.moon,tattooPlacement:.back)),
 Case(prompt:"A bird on the hand, green flats, and a red t-shirt complete the look.",key:Values(topColor:.red,topStyle:.tshirt,shoeColor:.green,shoeStyle:.flats,tattooDesign:.bird,tattooPlacement:.hand))
]
struct Record: Codable { let caseIndex: Int; let repeatIndex: Int; let variant: String; let elapsedSeconds: Double; let answer: Values?; let expected: Values; let incorrectFields: [String]; let failure: String? }
let names=["topColor","topStyle","shoeColor","shoeStyle","tattooDesign","tattooPlacement"]
func generate(_ v: Int, _ prompt: String) async throws -> Values {
 let session = LanguageModelSession(instructions: "Extract the requested look from the text. Use only the information provided. A t-shirt is tshirt.")
 switch v {
 case 0: let x=try await session.respond(to:prompt,generating:FlatLook.self).content; return Values(topColor:x.topColor,topStyle:x.topStyle,shoeColor:x.shoeColor,shoeStyle:x.shoeStyle,tattooDesign:x.tattooDesign,tattooPlacement:x.tattooPlacement)
 case 1: let x=try await session.respond(to:prompt,generating:MeaningfulLook.self).content; return Values(topColor:x.top.topColor,topStyle:x.top.topStyle,shoeColor:x.shoes.shoeColor,shoeStyle:x.shoes.shoeStyle,tattooDesign:x.tattoo.tattooDesign,tattooPlacement:x.tattoo.tattooPlacement)
 default: let x=try await session.respond(to:prompt,generating:MixedLook.self).content; return Values(topColor:x.groupOne.topColor,topStyle:x.groupThree.topStyle,shoeColor:x.groupTwo.shoeColor,shoeStyle:x.groupThree.shoeStyle,tattooDesign:x.groupOne.tattooDesign,tattooPlacement:x.groupTwo.tattooPlacement)
 }
}
@main struct Main { static func main() async throws {
 guard SystemLanguageModel.default.isAvailable else { fputs("Model unavailable\n",stderr); exit(2) }
 let path=CommandLine.arguments[1]; FileManager.default.createFile(atPath:path,contents:nil); let handle=try FileHandle(forWritingTo:URL(fileURLWithPath:path)); defer { try? handle.close() }
 let enc=JSONEncoder(); enc.outputFormatting=[.sortedKeys]; let variants=["flat","meaningful","mixed"]
 for rep in 0..<3 { for (i,c) in cases.enumerated() { for j in 0..<3 {
 let v=(j+i+rep)%3, start=ContinuousClock.now; var answer: Values?; var failure:String?
 do { answer=try await generate(v,c.prompt) } catch { failure=String(describing:error) }
 let elapsed=Double((ContinuousClock.now-start).components.seconds)+Double((ContinuousClock.now-start).components.attoseconds)/1e18
 let wrong=answer.map { ans in zip(names,zip(ans.strings,c.key.strings)).compactMap { name,pair in pair.0 == pair.1 ? nil : name } } ?? names
 let row=Record(caseIndex:i+1,repeatIndex:rep+1,variant:variants[v],elapsedSeconds:elapsed,answer:answer,expected:c.key,incorrectFields:wrong,failure:failure)
 try handle.write(contentsOf:enc.encode(row)); try handle.write(contentsOf:Data("\n".utf8)); print("\(rep+1) \(i+1) \(variants[v]): \(failure == nil ? "ok" : "failed") wrong=\(wrong.joined(separator:","))"); fflush(stdout)
 } } }
} }
