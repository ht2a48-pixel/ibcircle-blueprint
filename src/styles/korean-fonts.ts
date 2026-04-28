// Side-effect module: importing this file pulls in the Korean (Noto Sans KR)
// font weights. Imported only by Korean-content routes (e.g. the public
// homepage) so admin/owner routes don't download these files.
import "@fontsource/noto-sans-kr/400.css";
import "@fontsource/noto-sans-kr/500.css";
import "@fontsource/noto-sans-kr/700.css";
