# JOINFLIX

<details>
<summary><h3>🇺🇸 English (Click to expand)</h3></summary>

### Project Overview
A real-time **watch-party platform** where users can watch videos together while interacting live. The system adopts a progressive **real-time synchronization** architecture, evolving from **HTTP to SSE, WebSocket, and WebRTC** to achieve stable, low-latency group viewing.

### 📡 Communication Strategy
The platform utilizes a layered real-time communication strategy:

| Protocol | Use Case | Implementation Details |
| :--- | :--- | :--- |
| **HTTP** | **CRUD** | User Authentication, Party Room creation |
| **SSE** | **Notifications** | Server-driven notification feeds & Friend requests |
| **WebSocket** | **Video Sync** | Video synchronization & Chat |
| **WebRTC** | **P2P Audio** | Peer-to-peer audio communication |

#### 💡 Engineering Focus: Why this architecture?
* **HTTP > SSE:** Optimized network overhead by replacing polling with server-sent events.
* **WebSocket vs. WebRTC:** Used P2P for audio to minimize server load and maximize speed.
* **High Stability:** Decoupled protocols to ensure system-wide reliability.
</details>

<details open>
<summary><h3>🇰🇷 한국어 (클릭하여 펼치기)</h3></summary>

### 프로젝트 개요
여러 사용자가 함께 영상을 시청하고 실시간으로 소통할 수 있는 **워치 파티 플랫폼**입니다. 안정적인 **실시간 동기화**를 위해 **HTTP, SSE, WebSocket, WebRTC** 다양한 통신 방식을 단계적으로 적용한 아키텍처를 구현했습니다.

### 📡 통신 전략
본 플랫폼은 높은 안정성과 저지연성을 확보하기 위해 계층별 실시간 통신 전략을 사용합니다.

| Protocol | Use Case | Implementation Details |
| :--- | :--- | :--- |
| **HTTP** | **CRUD** | 사용자 인증, 파티룸 생성 |
| **SSE** | **Notifications** | 서버 주도의 알림 피드 및 친구 요청 수신 |
| **WebSocket** | **Video Sync, Chat** | 영상 재생 동기화 및 실시간 채팅 |
| **WebRTC** | **P2P Audio** | 사용자 간 음성 통신 |

#### 💡 Engineering Focus: 왜 이러한 구조를 선택했는가?
* **HTTP > SSE:** 모든 상태 확인을 폴링으로 처리하지 않고 서버 이벤트를 즉각 전달하여 오버헤드 최적화.
* **WebSocket > WebRTC:** 음성 데이터는 P2P 방식을 채택하여 서버 부하 감소 및 전송 속도 극대화.
* **High Stability:** 프로토콜 간 결합도를 낮춘(Decoupled) 아키텍처를 지향하여 안정성 확보.
</details>
