const PATH_D =
  "M1920 250.4H1274.6L1274.2 251.3C1271.8 256.4 1265.9 256.2 1263.8 250.9L1263.4 250C1257.9 238.4 1254.8 239.3 1251.8 250C1248.8 260 1245.7 279.9 1239.2 291.3C1232.6 302.7 1229.1 281.2 1225.6 250.1C1222.1 219.6 1218.5 179.5 1211.1 168.5C1203.6 157.5 1199.7 199.2 1195.8 250C1191.9 300.2 1187.9 359.6 1179.8 370C1171.6 380.3 1167.4 319.4 1163.1 250.1C1158.8 181.3 1154.6 104.1 1145.9 94.6001C1137.1 85.2001 1132.6 163.8 1128.2 250C1123.7 335.6 1119.2 428.8 1110.1 437.1C1100.9 445.2 1096.3 350.9 1091.6 250.1C1086.9 149.8 1082.3 43.0001 1072.9 36.2001C1063.5 29.6001 1058.8 137.3 1054 250C1049.3 362.4 1044.5 479.8 1035 484.8C1025.5 489.7 1020.8 371.6 1016 250C1011.3 128.7 1006.5 4.00007 997.1 1.00007C978.4 -5.29993 978.3 503.3 959.9 505.4C941.5 503.3 941.5 -5.39993 922.7 1.00007C913.3 4.00007 908.6 128.7 903.8 250C899.1 371.5 894.3 489.6 884.8 484.8C875.3 479.8 870.6 362.4 865.8 250C861.1 137.3 856.3 29.6001 846.9 36.2001C837.5 43.0001 832.8 149.7 828.2 250.1C823.6 350.9 818.9 445.2 809.7 437.1C800.5 428.9 796.1 335.7 791.6 250C787.1 163.9 782.6 85.2001 773.9 94.6001C765.2 104 760.9 181.3 756.7 250.1C752.5 319.4 748.2 380.3 740 370C731.8 359.6 727.9 300.2 724 250C720.1 199.2 716.2 157.5 708.7 168.5C701.3 179.5 697.7 219.7 694.2 250.1C690.7 281.2 687.2 302.7 680.6 291.3C674.1 279.9 671 260 668 250C665 239.3 662 238.5 656.4 250L656 250.9C653.8 256.2 648 256.4 645.6 251.3L645.2 250.4H0";

// Total path length (matches the source markup's own dash values), used to
// build a highlight segment that travels the full length once per loop.
const PATH_LENGTH = 7113.79;
const HIGHLIGHT_LENGTH = 180;

export default function EcgDivider() {
  return (
    <div className="w-full bg-paper py-8" aria-hidden="true">
      <svg width="100%" viewBox="0 0 1920 507" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g clipPath="url(#ecg-divider-clip)">
          {/* Base line — visible resting state of the whole path. */}
          <path
            d={PATH_D}
            stroke="var(--ink-muted)"
            strokeOpacity="0.3"
            strokeWidth="2"
            strokeMiterlimit="10"
          />
          {/* Traveling highlight — a short, muted segment that sweeps the
              entire path once per loop, then repeats seamlessly. */}
          <path
            d={PATH_D}
            stroke="var(--ink)"
            strokeOpacity="0.55"
            strokeWidth="2"
            strokeLinecap="round"
            strokeMiterlimit="10"
            style={{
              strokeDasharray: `${HIGHLIGHT_LENGTH} ${PATH_LENGTH}`,
              animation: "ecg-travel 4s linear infinite",
            }}
          />
        </g>
        <defs>
          <clipPath id="ecg-divider-clip">
            <rect width="1920" height="506.5" fill="white" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
}
