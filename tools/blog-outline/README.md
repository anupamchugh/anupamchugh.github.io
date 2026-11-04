# Local blog outline experiment

This experimental Swift command uses ModelRelay 0.2.0 and Apple's on-device model to propose a headline, central idea, outline, and verification questions from a local UTF-8 notes file. It does not publish or connect to the blog. Requires Swift 6.4 and a Mac with Apple Intelligence available. SwiftPM downloads ModelRelay and its dependencies on first build.

Run from this folder:

    swift run RelayProbe sample-notes.txt
    swift run RelayProbe /path/to/your-notes.txt

Only use notes you intend to process. Review every output against the source: one test misleadingly proposed a headline about bookings when the notes said visits did not establish bookings. The instruction to avoid invented facts is not a correctness guarantee. Input is limited to 8,000 characters. The local model is selected explicitly; this project does not use Ollama or configure a cloud provider.
