import { motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import io from "socket.io-client";
import Peer from "simple-peer";
import {
  Copy,
  Mic,
  MicOff,
  Phone,
  PhoneOff,
  ScreenShare,
  ScreenShareOff,
  Video,
  VideoOff,
  Users,
  Sparkles,
} from "lucide-react";

const SIGNALING_URL = import.meta.env.VITE_SIGNALING_URL || "http://localhost:3001";
const socket = io(SIGNALING_URL, { autoConnect: false, transports: ["websocket", "polling"] });

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

function makeRoomCode() {
  return Math.random().toString(36).slice(2, 8).toUpperCase();
}

function Avatar({ label, large = false }) {
  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 via-violet-500 to-fuchsia-400 font-semibold text-white shadow-lg",
        large ? "h-16 w-16 text-xl" : "h-11 w-11 text-sm"
      )}
    >
      {label}
    </div>
  );
}

function VideoTile({ title, subtitle, stream, muted = false, isPlaceholder = false, highlighted = false }) {
  const ref = useRef(null);

  useEffect(() => {
    if (ref.current && stream) ref.current.srcObject = stream;
  }, [stream]);

  return (
    <motion.div
      layout
      whileHover={{ y: -4 }}
      className={cn(
        "relative overflow-hidden rounded-[28px] border border-white/30 bg-white/20 shadow-[0_20px_60px_rgba(92,76,255,0.14)] backdrop-blur-2xl",
        highlighted && "ring-1 ring-white/50"
      )}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-white/10 to-white/5" />

      {stream ? (
        <video
          ref={ref}
          autoPlay
          playsInline
          muted={muted}
          className="relative h-full min-h-[220px] w-full object-cover bg-slate-900"
        />
      ) : (
        <div className="relative flex min-h-[220px] items-center justify-center bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.5),_rgba(255,255,255,0.08)_35%,_rgba(99,102,241,0.28)_75%,_rgba(244,114,182,0.2)_100%)]">
          <div className="flex flex-col items-center gap-3 text-slate-700">
            <Avatar label={title?.[0]?.toUpperCase() || "U"} large />
            <div className="text-center">
              <div className="text-lg font-semibold">{title}</div>
              <div className="text-sm text-slate-500">{subtitle}</div>
            </div>
          </div>
        </div>
      )}

      {isPlaceholder && !stream && (
        <div className="absolute inset-x-0 bottom-0 top-0 bg-gradient-to-b from-transparent to-white/5" />
      )}

      <div className="absolute left-3 top-3 rounded-full bg-white/50 px-3 py-1 text-xs font-medium text-slate-700 backdrop-blur-md">
        {subtitle}
      </div>
      <div className="absolute bottom-3 left-3 rounded-full bg-black/25 px-3 py-1.5 text-sm font-medium text-white backdrop-blur-md">
        {title}
      </div>
    </motion.div>
  );
}

export default function NovaMeetUI() {
  const [name, setName] = useState("");
  const [room, setRoom] = useState(makeRoomCode());
  const [joined, setJoined] = useState(false);
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(true);
  const [sharing, setSharing] = useState(false);
  const [error, setError] = useState("");
  const [copyState, setCopyState] = useState(false);
  const [participants, setParticipants] = useState([]);
  const [localStream, setLocalStream] = useState(null);

  const peersRef = useRef({});
  const localStreamRef = useRef(null);
  const screenTrackRef = useRef(null);

  useEffect(() => {
    return () => cleanupCall();
  }, []);

  const participantCount = useMemo(() => 1 + participants.length, [participants.length]);

  const ensureSocket = () => {
    if (!socket.connected) socket.connect();
  };

  const registerSocketHandlers = (stream) => {
    socket.off("all-users");
    socket.off("user-joined");
    socket.off("receiving-returned-signal");
    socket.off("user-left");
    socket.off("room-error");

    socket.on("all-users", (users) => {
      users.forEach(({ userId, userName }) => {
        const peer = createPeer(userId, socket.id, stream, userName);
        peersRef.current[userId] = { peer, name: userName || "Участник", stream: null };
      });
    });

    socket.on("user-joined", ({ signal, callerId, userName }) => {
      const peer = addPeer(signal, callerId, stream, userName);
      peersRef.current[callerId] = { peer, name: userName || "Участник", stream: null };
    });

    socket.on("receiving-returned-signal", ({ id, signal }) => {
      const item = peersRef.current[id];
      if (item) item.peer.signal(signal);
    });

    socket.on("user-left", (userId) => {
      const item = peersRef.current[userId];
      if (item) item.peer.destroy();
      delete peersRef.current[userId];
      setParticipants((prev) => prev.filter((p) => p.id !== userId));
    });

    socket.on("room-error", (message) => setError(message || "Ошибка подключения к комнате"));
  };

  const createPeer = (userToSignal, callerId, stream, userName) => {
    const peer = new Peer({ initiator: true, trickle: false, stream });

    peer.on("signal", (signal) => {
      socket.emit("sending-signal", { userToSignal, callerId, signal, userName: name || "Гость" });
    });

    peer.on("stream", (remoteStream) => {
      setParticipants((prev) => {
        const exists = prev.find((p) => p.id === userToSignal);
        if (exists) return prev.map((p) => (p.id === userToSignal ? { ...p, stream: remoteStream, name: userName || p.name } : p));
        return [...prev, { id: userToSignal, name: userName || "Участник", stream: remoteStream }];
      });
    });

    return peer;
  };

  const addPeer = (incomingSignal, callerId, stream, userName) => {
    const peer = new Peer({ initiator: false, trickle: false, stream });

    peer.on("signal", (signal) => {
      socket.emit("returning-signal", { signal, callerId });
    });

    peer.on("stream", (remoteStream) => {
      setParticipants((prev) => {
        const exists = prev.find((p) => p.id === callerId);
        if (exists) return prev.map((p) => (p.id === callerId ? { ...p, stream: remoteStream, name: userName || p.name } : p));
        return [...prev, { id: callerId, name: userName || "Участник", stream: remoteStream }];
      });
    });

    peer.signal(incomingSignal);
    return peer;
  };

  const joinRoom = async () => {
    setError("");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setLocalStream(stream);
      localStreamRef.current = stream;
      ensureSocket();
      registerSocketHandlers(stream);
      socket.emit("join-room", { roomId: room.trim(), userName: name.trim() || "Гость" });
      setJoined(true);
    } catch (e) {
      setError("Не удалось получить доступ к камере или микрофону");
    }
  };

  const cleanupCall = () => {
    Object.values(peersRef.current).forEach(({ peer }) => peer.destroy());
    peersRef.current = {};
    setParticipants([]);

    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => track.stop());
      localStreamRef.current = null;
    }

    if (screenTrackRef.current) {
      screenTrackRef.current.stop();
      screenTrackRef.current = null;
    }

    setLocalStream(null);
    if (socket.connected) socket.disconnect();
  };

  const leaveCall = () => {
    cleanupCall();
    setJoined(false);
    setSharing(false);
    setMicOn(true);
    setCamOn(true);
  };

  const toggleMic = () => {
    if (!localStreamRef.current) return;
    const enabled = !micOn;
    localStreamRef.current.getAudioTracks().forEach((track) => {
      track.enabled = enabled;
    });
    setMicOn(enabled);
  };

  const toggleCam = () => {
    if (!localStreamRef.current) return;
    const enabled = !camOn;
    localStreamRef.current.getVideoTracks().forEach((track) => {
      track.enabled = enabled;
    });
    setCamOn(enabled);
  };

  const replaceVideoTrack = (newTrack) => {
    const oldTrack = localStreamRef.current?.getVideoTracks?.()[0];
    if (!localStreamRef.current || !newTrack) return;

    if (oldTrack) {
      localStreamRef.current.removeTrack(oldTrack);
      oldTrack.stop();
    }
    localStreamRef.current.addTrack(newTrack);
    setLocalStream(new MediaStream(localStreamRef.current.getTracks()));

    Object.values(peersRef.current).forEach(({ peer }) => {
      try {
        peer.replaceTrack(oldTrack, newTrack, localStreamRef.current);
      } catch (_) {}
    });
  };

  const toggleScreenShare = async () => {
    if (!joined || !localStreamRef.current) return;

    if (!sharing) {
      try {
        const displayStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
        const screenTrack = displayStream.getVideoTracks()[0];
        screenTrackRef.current = screenTrack;
        replaceVideoTrack(screenTrack);
        setSharing(true);
        screenTrack.onended = async () => {
          try {
            const camStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
            const camTrack = camStream.getVideoTracks()[0];
            replaceVideoTrack(camTrack);
            setSharing(false);
          } catch (_) {
            setSharing(false);
          }
        };
      } catch (_) {
        setError("Не удалось включить демонстрацию экрана");
      }
    } else {
      try {
        const camStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
        const camTrack = camStream.getVideoTracks()[0];
        replaceVideoTrack(camTrack);
      } catch (_) {}
      if (screenTrackRef.current) screenTrackRef.current.stop();
      screenTrackRef.current = null;
      setSharing(false);
    }
  };

  const copyInvite = async () => {
    const url = `${window.location.origin}?room=${room}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopyState(true);
      setTimeout(() => setCopyState(false), 1600);
    } catch (_) {}
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const roomParam = params.get("room");
    if (roomParam) setRoom(roomParam.toUpperCase());
  }, []);

  if (!joined) {
    return (
      <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#dce4ff] via-[#d7dbff] to-[#f5dcff] px-6 py-10 text-slate-900">
        <motion.div
          className="absolute left-0 top-0 h-80 w-80 rounded-full bg-fuchsia-300/40 blur-[120px]"
          animate={{ x: [0, 60, 0], y: [0, 40, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-0 right-0 h-[26rem] w-[26rem] rounded-full bg-cyan-300/35 blur-[140px]"
          animate={{ x: [0, -40, 0], y: [0, -60, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        />

        <div className="relative mx-auto grid min-h-screen max-w-7xl items-center gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-[36px] border border-white/60 bg-white/35 p-8 shadow-[0_25px_80px_rgba(81,67,255,0.14)] backdrop-blur-2xl lg:p-10"
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/45 px-3 py-1 text-xs font-semibold uppercase tracking-[0.28em] text-indigo-500">
              <Sparkles className="h-3.5 w-3.5" />
              Browser meeting app
            </div>

            <div className="mb-4 flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-[18px] bg-gradient-to-br from-indigo-500 via-violet-500 to-fuchsia-400 text-xl font-bold text-white shadow-lg">
                N
              </div>
              <h1 className="text-5xl font-semibold tracking-tight lg:text-6xl">NovaMeet</h1>
            </div>

            <p className="max-w-xl text-lg leading-8 text-slate-600">
              Красивые рабочие созвоны прямо в браузере. По ссылке. Без установки. С современным интерфейсом и мягкими анимациями.
            </p>

            <div className="mt-8 grid gap-4 md:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-500">Ваше имя</span>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Например, Ксения"
                  className="h-14 w-full rounded-2xl border border-white/50 bg-white/60 px-4 outline-none transition focus:border-indigo-300 focus:bg-white"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-500">Комната</span>
                <input
                  value={room}
                  onChange={(e) => setRoom(e.target.value.toUpperCase())}
                  placeholder="Код комнаты"
                  className="h-14 w-full rounded-2xl border border-white/50 bg-white/60 px-4 outline-none transition focus:border-indigo-300 focus:bg-white"
                />
              </label>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                onClick={joinRoom}
                className="rounded-2xl bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500 px-6 py-4 font-semibold text-white shadow-[0_14px_40px_rgba(97,76,255,0.35)] transition hover:scale-[1.02]"
              >
                Войти в комнату
              </button>
              <button
                onClick={() => setRoom(makeRoomCode())}
                className="rounded-2xl border border-white/50 bg-white/55 px-6 py-4 font-semibold text-indigo-500 backdrop-blur-xl transition hover:bg-white/70"
              >
                Сгенерировать код
              </button>
            </div>

            {error && <div className="mt-4 rounded-2xl bg-rose-100 px-4 py-3 text-sm text-rose-600">{error}</div>}

            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {[
                ["По ссылке", "Открыли браузер и подключились без лишней установки."],
                ["Для работы", "Участники, чат, микрофон, камера и экран."],
                ["Современный UI", "Светлый glassmorphism интерфейс с понятной навигацией."],
              ].map(([title, text]) => (
                <div key={title} className="rounded-[24px] border border-white/50 bg-white/40 p-4 backdrop-blur-xl">
                  <div className="mb-2 font-semibold text-slate-800">{title}</div>
                  <div className="text-sm leading-6 text-slate-500">{text}</div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-[36px] border border-white/60 bg-white/28 p-5 shadow-[0_25px_80px_rgba(81,67,255,0.14)] backdrop-blur-2xl"
          >
            <div className="mb-4 flex items-center justify-between">
              <div>
                <div className="text-xs font-semibold uppercase tracking-[0.28em] text-indigo-400">Live preview</div>
                <div className="mt-2 text-3xl font-semibold">Комната встречи</div>
              </div>
              <div className="rounded-full bg-white/50 px-3 py-1 text-xs font-semibold text-indigo-500">telemost-like</div>
            </div>

            <div className="space-y-4">
              <VideoTile title="Алина" subtitle="Хост" isPlaceholder highlighted />
              <div className="grid gap-4 md:grid-cols-2">
                <VideoTile title="Максим" subtitle="Маркетинг" isPlaceholder />
                <VideoTile title="Ирина" subtitle="Дизайн" isPlaceholder />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#dce4ff] via-[#d7dbff] to-[#f5dcff] px-4 py-4 text-slate-900 lg:px-6">
      <motion.div
        className="absolute left-0 top-0 h-72 w-72 rounded-full bg-fuchsia-300/35 blur-[120px]"
        animate={{ x: [0, 60, 0], y: [0, 40, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-0 right-0 h-[24rem] w-[24rem] rounded-full bg-cyan-300/35 blur-[130px]"
        animate={{ x: [0, -40, 0], y: [0, -40, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="relative mx-auto flex min-h-screen max-w-[1500px] gap-4 lg:gap-5">
        <div className="flex min-w-0 flex-1 flex-col gap-4">
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-[28px] border border-white/55 bg-white/30 px-5 py-4 shadow-[0_25px_80px_rgba(81,67,255,0.12)] backdrop-blur-2xl">
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.24em] text-indigo-400">NovaMeet room</div>
              <div className="mt-1 text-2xl font-semibold">Комната {room}</div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <div className="rounded-full bg-white/45 px-3 py-2 text-sm font-medium text-slate-600">
                Участников: {participantCount}
              </div>
              <button
                onClick={copyInvite}
                className="flex items-center gap-2 rounded-2xl border border-white/50 bg-white/55 px-4 py-3 font-medium text-indigo-500 backdrop-blur-xl"
              >
                <Copy className="h-4 w-4" />
                {copyState ? "Ссылка скопирована" : "Копировать ссылку"}
              </button>
            </div>
          </div>

          <div className="grid flex-1 gap-4 xl:grid-cols-[1.2fr_0.8fr]">
            <div className="grid gap-4">
              <VideoTile
                title={name.trim() || "Вы"}
                subtitle={sharing ? "Вы · экран" : "Вы"}
                stream={camOn ? localStream : null}
                muted
                highlighted
              />

              <div className={cn("grid gap-4", participants.length <= 1 ? "md:grid-cols-1" : "md:grid-cols-2") }>
                {participants.length ? (
                  participants.map((participant) => (
                    <VideoTile
                      key={participant.id}
                      title={participant.name}
                      subtitle="Участник"
                      stream={participant.stream}
                    />
                  ))
                ) : (
                  <VideoTile title="Ожидание" subtitle="Подключение участников" isPlaceholder />
                )}
              </div>
            </div>

            <div className="grid gap-4">
              <div className="rounded-[28px] border border-white/55 bg-white/30 p-5 shadow-[0_25px_80px_rgba(81,67,255,0.12)] backdrop-blur-2xl">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <div className="text-sm text-slate-500">Панель встречи</div>
                    <div className="text-xl font-semibold">Состояние звонка</div>
                  </div>
                  <Users className="h-5 w-5 text-indigo-400" />
                </div>

                <div className="grid gap-3">
                  {[
                    ["Микрофон", micOn ? "Включен" : "Выключен"],
                    ["Камера", camOn ? "Включена" : "Выключена"],
                    ["Демонстрация", sharing ? "Активна" : "Нет"],
                  ].map(([label, value]) => (
                    <div key={label} className="rounded-2xl border border-white/50 bg-white/40 px-4 py-3">
                      <div className="text-xs uppercase tracking-wide text-slate-400">{label}</div>
                      <div className="mt-1 font-medium text-slate-700">{value}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[28px] border border-white/55 bg-white/30 p-5 shadow-[0_25px_80px_rgba(81,67,255,0.12)] backdrop-blur-2xl">
                <div className="mb-4 text-xl font-semibold">Участники</div>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 rounded-2xl border border-white/45 bg-white/40 p-3">
                    <Avatar label={(name.trim() || "Вы")[0]?.toUpperCase() || "В"} />
                    <div>
                      <div className="font-medium">{name.trim() || "Вы"}</div>
                      <div className="text-sm text-slate-500">Хост</div>
                    </div>
                  </div>
                  {participants.map((participant) => (
                    <div key={participant.id} className="flex items-center gap-3 rounded-2xl border border-white/45 bg-white/40 p-3">
                      <Avatar label={participant.name?.[0]?.toUpperCase() || "U"} />
                      <div>
                        <div className="font-medium">{participant.name}</div>
                        <div className="text-sm text-slate-500">Участник</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 rounded-[28px] border border-white/55 bg-white/30 px-4 py-4 shadow-[0_25px_80px_rgba(81,67,255,0.12)] backdrop-blur-2xl">
            <button
              onClick={toggleMic}
              className={cn(
                "flex items-center gap-2 rounded-2xl px-5 py-4 font-medium text-white shadow-lg transition",
                micOn ? "bg-gradient-to-r from-indigo-500 to-violet-500" : "bg-amber-500"
              )}
            >
              {micOn ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
              {micOn ? "Микрофон" : "Включить микрофон"}
            </button>

            <button
              onClick={toggleCam}
              className={cn(
                "flex items-center gap-2 rounded-2xl px-5 py-4 font-medium text-white shadow-lg transition",
                camOn ? "bg-gradient-to-r from-indigo-500 to-violet-500" : "bg-slate-500"
              )}
            >
              {camOn ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
              {camOn ? "Камера" : "Включить камеру"}
            </button>

            <button
              onClick={toggleScreenShare}
              className={cn(
                "flex items-center gap-2 rounded-2xl px-5 py-4 font-medium text-white shadow-lg transition",
                sharing ? "bg-cyan-500" : "bg-gradient-to-r from-indigo-500 to-violet-500"
              )}
            >
              {sharing ? <ScreenShareOff className="h-4 w-4" /> : <ScreenShare className="h-4 w-4" />}
              {sharing ? "Остановить показ" : "Показать экран"}
            </button>

            <button
              onClick={leaveCall}
              className="flex items-center gap-2 rounded-2xl bg-rose-500 px-5 py-4 font-medium text-white shadow-lg transition hover:bg-rose-600"
            >
              <PhoneOff className="h-4 w-4" />
              Завершить звонок
            </button>
          </div>

          {error && <div className="rounded-2xl bg-rose-100 px-4 py-3 text-sm text-rose-600">{error}</div>}
        </div>
      </div>
    </div>
  );
}
