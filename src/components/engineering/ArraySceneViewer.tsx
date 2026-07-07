import { Canvas } from "@react-three/fiber";
import { Html, OrbitControls } from "@react-three/drei";
import type { ArrayLayoutResult } from "@/services/simulation/layout";

export type EquipmentInfo = {
  label: string;
  detail: string;
  color: string;
};

type ArraySceneViewerProps = {
  layout: ArrayLayoutResult;
  tiltDegrees: number;
  azimuthDegrees: number;
  surface: "techo" | "patio";
  arrayInfo: EquipmentInfo;
  inverterInfo: EquipmentInfo;
  batteryInfo?: EquipmentInfo;
  transformerInfo?: EquipmentInfo;
};

function degToRad(deg: number) {
  return (deg * Math.PI) / 180;
}

function EquipmentLabel({ info }: { info: EquipmentInfo }) {
  return (
    <span className="pointer-events-none flex select-none flex-col items-center whitespace-nowrap rounded-xl bg-slate-900/85 px-2.5 py-1 text-center leading-tight text-white">
      <span className="text-[10px] font-semibold">{info.label}</span>
      <span className="text-[9px] text-white/80">{info.detail}</span>
    </span>
  );
}

function PanelArray({
  layout,
  tiltDegrees,
  azimuthDegrees,
  arrayInfo
}: Pick<ArraySceneViewerProps, "layout" | "tiltDegrees" | "azimuthDegrees" | "arrayInfo">) {
  const { areaWidthM, areaHeightM, cols, rows, panelWidthM, panelHeightM, marginM, gapM, panelsPlaced } = layout;
  const tiltRad = degToRad(tiltDegrees);
  const azimuthRad = degToRad(azimuthDegrees - 180);

  const originX = -areaWidthM / 2 + marginM;
  const originZ = -areaHeightM / 2 + marginM;

  const panels = Array.from({ length: panelsPlaced }, (_, index) => {
    const row = Math.floor(index / cols);
    const col = index % cols;
    return {
      x: originX + col * (panelWidthM + gapM) + panelWidthM / 2,
      z: originZ + row * (panelHeightM + gapM) + panelHeightM / 2
    };
  });

  const liftM = (panelHeightM / 2) * Math.sin(tiltRad) + 0.02;
  const arrayHeightM = rows * (panelHeightM + gapM);
  const arrayCenterZ = originZ + arrayHeightM / 2;

  return (
    <group rotation={[0, azimuthRad, 0]}>
      {panels.map((panel, index) => (
        <mesh key={index} position={[panel.x, liftM, panel.z]} rotation={[-tiltRad, 0, 0]} castShadow receiveShadow>
          <boxGeometry args={[panelWidthM * 0.96, 0.03, panelHeightM * 0.96]} />
          <meshStandardMaterial color="#1d4ed8" metalness={0.35} roughness={0.35} />
        </mesh>
      ))}
      <Html position={[0, liftM + 0.6, arrayCenterZ]} center distanceFactor={8} occlude>
        <EquipmentLabel info={arrayInfo} />
      </Html>
    </group>
  );
}

function EquipmentMarker({ position, info }: { position: [number, number, number]; info: EquipmentInfo }) {
  return (
    <group position={position}>
      <mesh castShadow>
        <boxGeometry args={[0.4, 0.4, 0.4]} />
        <meshStandardMaterial color={info.color} />
      </mesh>
      <Html position={[0, 0.5, 0]} center distanceFactor={8} occlude>
        <EquipmentLabel info={info} />
      </Html>
    </group>
  );
}

export function ArraySceneViewer({
  layout,
  tiltDegrees,
  azimuthDegrees,
  surface,
  arrayInfo,
  inverterInfo,
  batteryInfo,
  transformerInfo
}: ArraySceneViewerProps) {
  const markers: EquipmentInfo[] = [inverterInfo];
  if (batteryInfo) markers.push(batteryInfo);
  if (transformerInfo) markers.push(transformerInfo);

  const spacing = 1.1;
  const startX = -((markers.length - 1) * spacing) / 2;
  const cameraDistance = Math.max(layout.areaWidthM, layout.areaHeightM, 4);

  return (
    <div className="h-80 w-full overflow-hidden rounded-2xl bg-slate-100 dark:bg-white/5">
      <Canvas shadows camera={{ position: [cameraDistance * 0.9, cameraDistance * 0.8, cameraDistance * 1.1], fov: 45 }}>
        <ambientLight intensity={0.7} />
        <directionalLight position={[6, 9, 4]} intensity={1.1} castShadow />

        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[layout.areaWidthM, layout.areaHeightM]} />
          <meshStandardMaterial color={surface === "techo" ? "#94a3b8" : "#a8a29e"} />
        </mesh>

        <PanelArray layout={layout} tiltDegrees={tiltDegrees} azimuthDegrees={azimuthDegrees} arrayInfo={arrayInfo} />

        {markers.map((marker, index) => (
          <EquipmentMarker
            key={marker.label}
            position={[startX + index * spacing, 0.2, layout.areaHeightM / 2 + 0.6]}
            info={marker}
          />
        ))}

        <OrbitControls enablePan={false} maxPolarAngle={Math.PI / 2.1} minDistance={cameraDistance * 0.6} maxDistance={cameraDistance * 3} />
      </Canvas>
    </div>
  );
}
