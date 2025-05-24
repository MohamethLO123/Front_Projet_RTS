import Header from "./Header";
import Sidebar from "./Sidebar";
import Footer from "./Footer";

export default function Layout({ children }) {
  return (
    <div className="d-flex flex-column" style={{ minHeight: "100vh" }}>
      <Header />
      <div className="d-flex flex-grow-1">
        <Sidebar />
        <main className="p-4" style={{ marginLeft: "250px", width: "100%" }}>
          {children}
        </main>
      </div>
      <Footer />
    </div>
  );
}
