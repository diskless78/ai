import { Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";

interface ArrowProps {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  x3: number;
  y3: number;
  color: string;
  valueX: number;
  valueY: number;
  value: string;
  fontSize: number;
  index: any;
  totalPeople?: number;
  fillColor?: string;
}
export default function ArrowImage({
  x1,
  y1,
  x2,
  y2,
  x3,
  y3,
  color,
  valueX,
  valueY,
  value,
  fontSize,
  index,
  totalPeople,
  fillColor = 'white',
}: ArrowProps) {
  const theme = useTheme();

  return (
    <>
      {!x3 || !y3 ? (
        <>
          <svg
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              top: 0,
              left: 0,
              pointerEvents: 'none',
            }}
          >
            <defs>
              <marker
                id={index}
                markerWidth='3'
                markerHeight='2'
                refX='0'
                refY='1'
                orient='auto'
                fill={color}
              >
                <polygon points='0 0, 3 1, 0 2' />
              </marker>
            </defs>
            <line
              x1={`${x1 * 100}%`}
              y1={`${y1 * 100}%`}
              x2={`${x2 * 100}%`}
              y2={`${y2 * 100}%`}
              stroke={color}
              markerEnd={`url(#${index})`}
              style={{
                strokeWidth: `${fontSize / 10 - 3}px`,
              }}
            />
          </svg>
          <div
            style={{
              position: 'absolute',
              left: `${valueX * 100}%`,
              top: `${valueY * 95}%`,
              transform: 'translate(-60%, -60%)',
              boxShadow: theme.customShadows.card0,
              backgroundColor: '#FFFFFF',
              padding: '2px 12px 2px 8px',
              borderRadius: '6px',
              border: `1px solid ${theme.palette.neutral[10]}`,
              whiteSpace: 'nowrap',
              zIndex: 10,
              display: 'flex',
              flexDirection: 'column',
              gap: '1px',
            }}
          >
            <Typography style={{ ...theme.typography.b3Regular ,fontSize: '14px', fontWeight: 500, color: theme.palette.neutral[100] }}>
              {totalPeople}
            </Typography>
            <Typography style={{ ...theme.typography.b4Regular, fontSize: '12px', fontWeight: 400, color: theme.palette.neutral[70]}}>
              {value}
            </Typography>
          </div>
        </>
      ) : (
        <>
          <svg
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              top: 0,
              left: 0,
              pointerEvents: 'none',
            }}
          >
            <defs>
              <marker
                id={index}
                markerWidth='3'
                markerHeight='2'
                refX='0'
                refY='1'
                orient='auto'
                fill={color}
              >
                <polygon points='0 0, 3 1, 0 2' />
              </marker>
            </defs>
            <line
              x1={`${x1 * 100}%`}
              y1={`${y1 * 100}%`}
              x2={`${x3 * 100}%`}
              y2={`${y3 * 100}%`}
              stroke={color}
              style={{
                strokeWidth: `${fontSize / 10 - 3}px`,
              }}
            />
            <line
              x1={`${x3 * 100}%`}
              y1={`${y3 * 100}%`}
              x2={`${x2 * 100}%`}
              y2={`${y2 * 100}%`}
              stroke={color}
              markerEnd={`url(#${index})`}
              style={{
                strokeWidth: `${fontSize / 10 - 3}px`,
              }}
            />
          </svg>
          <div
            style={{
              position: 'absolute',
              left: `${valueX * 100}%`,
              top: `${valueY * 100}%`,
              transform: 'translate(-50%, -50%)',
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
              color: fillColor,
              padding: '4px 8px',
              borderRadius: '4px',
              border: `1px solid ${theme.palette.neutral[10]}`,
              fontSize: '12px',
              fontWeight: 'bold',
              whiteSpace: 'nowrap',
              zIndex: 10,
            }}
          >
            {value}
          </div>
        </>
      )}
    </>
  );
}
