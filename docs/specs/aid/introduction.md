#  **Introduction**

Connecting AI agents to tools and services is currently a messy, manual process. Developers and users are forced to hunt through documentation, copy-paste API endpoints, and manually configure authentication tokens for every new integration. This friction slows down development and creates a poor user experience.

**Agent Interface Discovery (AID)** solves this.

It's a simple, open standard that uses a standard DNS record to let any client automatically discover how to connect to an agent service, given only its domain name (e.g., `supabase.com`). AID tells a client everything it needs: the correct API endpoint, the communication protocol to use (like MCP or A2A), and the required authentication method.

The goal is to create a "just works" experience for the agentic web, replacing fragile, manual setup with automated, reliable discovery.

---

### State Diagram Analysis: How AID Aligns and Extends

AID does not compete with protocols like MCP (Agent-Client Protocol), A2A (Agent-to-Agent), or ACP (IBM's Agent Control Plane). Instead, **AID is a prerequisite discovery layer** that enables them.

*   **What MCP/A2A/ACP define:** The *language* agents speak once a connection is established (e.g., "create task," "execute step," "here are the artifacts"). They answer the question: "**What do we say?**"
*   **What AID defines:** The process for finding the agent in the first place. It answers the questions: "**Where are you?**" and "**How do we start talking?**"

**Therefore, AID extends these protocols by providing the missing "Chapter 0" of their specifications: Service Discovery.** The state diagram below illustrates this handoff. The process begins with AID and concludes by initiating a session using the protocol that AID discovered.

### State Diagram

```mermaid
stateDiagram-v2
    direction LR

    %% --- Phase 1: AID Discovery ---
    subgraph AID_Discovery_Phase ["AID Discovery Phase"]
        direction TB
        [*] --> DNS_Lookup
        DNS_Lookup: Client queries TXT record for\n_agent.domain
        DNS_Lookup --> Parse_TXT
        Parse_TXT: Parse v=aid1; uri=...; proto=...
        Parse_TXT --> Is_Config_Present{Has config key?}
        Is_Config_Present --> |No Simple Profile| Ready_To_Connect
        Is_Config_Present --> |Yes Extended Profile| Fetch_Manifest
        Fetch_Manifest: GET /.well-known/aid.json
        Fetch_Manifest --> Process_Manifest
        Process_Manifest: Client chooses an implementation\ne.g., remote API, local Docker
        Process_Manifest --> Gather_Credentials
        Gather_Credentials: Prompt user for secrets/paths\nbased on authentication & configuration
        Gather_Credentials --> Ready_To_Connect
        Ready_To_Connect: Client has endpoint, protocol,\nand credentials.
    end

    %% --- Handoff Point ---
    Ready_To_Connect --> Handoff: AID Discovery Complete

    %% --- Phase 2: Agent Communication ---
    subgraph Agent_Communication_Phase ["Agent Communication Phase"]
        direction TB
        Handoff --> Protocol_Choice{Which Protocol was Discovered?}
        Protocol_Choice --> |proto = mcp| MCP_Session
        Protocol_Choice --> |proto = a2a| A2A_Session
        Protocol_Choice --> |proto = acp| ACP_Session
        Protocol_Choice --> |other| Other_Protocol_Session
        MCP_Session: Communicate via MCP
        A2A_Session: Communicate via A2A
        ACP_Session: Communicate via ACP IBM
        Other_Protocol_Session: Communicate via other\ndiscovered protocol
        MCP_Session --> [*]
        A2A_Session --> [*]
        ACP_Session --> [*]
        Other_Protocol_Session --> [*]
    end

    note right of Handoff : AID's job is done.\nThe client now uses the discovered\nprotocol MCP, A2A, etc.\nto communicate with the agent.
```
