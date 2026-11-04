import Foundation
import ModelRelay

@main struct RelayProbe {
    static func main() async throws {
        guard CommandLine.arguments.count == 2 else {
            print("Usage: RelayProbe /path/to/notes.txt")
            return
        }
        let url = URL(fileURLWithPath: CommandLine.arguments[1])
        let notes = try String(contentsOf: url, encoding: .utf8)
        guard !notes.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty, notes.count <= 8000 else {
            print("Supply nonempty UTF-8 notes of at most 8,000 characters.")
            return
        }
        let workflow = Workflow(name: "Outline from notes") {
            Step.extract("outline", instruction: "Use only the supplied notes. Do not invent facts, sources, quotes, links, or experiences. Propose a concise working headline, the central idea, and a short outline. Identify missing evidence as questions.", model: .appleOnDevice) {
                Field("headline", .text)
                Field("centralIdea", .text)
                Field("outline", .text)
                Field("questions", .text)
            }
        }
        let report = try await WorkflowExecutor().run(workflow, input: .text(notes))
        for (key, label) in [("headline", "Working headline"), ("centralIdea", "Central idea"), ("outline", "Outline"), ("questions", "Questions to check")] {
            print("\n\(label):\n\(report.output[key]?.textValue ?? "Not returned")")
        }
    }
}
