const RB = ReactBootstrap;
const { Alert, Card, Button, Table, Form, Row, Col } = ReactBootstrap;

// Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyBZY0OWNrpHH_KyVTuq8Zttk1q13jl1d0k",
  authDomain: "web2568-5fd94.firebaseapp.com",
  projectId: "web2568-5fd94",
  storageBucket: "web2568-5fd94.firebasestorage.app",
  messagingSenderId: "1047490015785",
  appId: "1:1047490015785:web:7d6a8e2c39925824646238",
  measurementId: "G-74J9PZ3ZVM"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();
const googleProvider = new firebase.auth.GoogleAuthProvider();

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      students: [],
      stdid: "",
      stdtitle: "",
      stdfname: "",
      stdlname: "",
      stdemail: "",
      stdphone: "",
      user: null
    };
  }

  // อ่านข้อมูลจาก Firestore
  readData = async () => {
    const querySnapshot = await db.collection("students").get();
    let studentsData = [];
    querySnapshot.forEach((doc) => {
      studentsData.push({ id: doc.id, ...doc.data() });
    });
    this.setState({ students: studentsData });
  };

  // อ่านข้อมูลแบบ Real-Time
  autoRead = () => {
    db.collection("students").onSnapshot((querySnapshot) => {
      let studentsData = [];
      querySnapshot.forEach((doc) => {
        studentsData.push({ id: doc.id, ...doc.data() });
      });
      this.setState({ students: studentsData });
    });
  };

  insertData = async () => {
    if (this.state.stdid && this.state.stdfname) {
      try {
        await db.collection("students").doc(this.state.stdid).set({
          title: this.state.stdtitle,
          fname: this.state.stdfname,
          lname: this.state.stdlname,
          phone: this.state.stdphone,
          email: this.state.stdemail
        });
        alert("✅ บันทึกข้อมูลสำเร็จ!");
        this.readData(); // โหลดข้อมูลใหม่
      } catch (error) {
        console.error("เกิดข้อผิดพลาดในการบันทึก:", error);
      }
    } else {
      alert("กรุณากรอกข้อมูลให้ครบก่อนกด Save!");
    }
  };
  

  // ลบข้อมูล
  deleteData = (std) => {
    if (confirm("ต้องการลบข้อมูลนี้?")) {
      db.collection("students").doc(std.id).delete();
    }
  };

  // แก้ไขข้อมูล
  edit = (std) => {
    this.setState({
      stdid: std.id,
      stdtitle: std.title,
      stdfname: std.fname,
      stdlname: std.lname,
      stdemail: std.email,
      stdphone: std.phone
    });
  };

  // Login ด้วย Google
  googleLogin = () => {
    auth.signInWithPopup(googleProvider);
  };

  // Logout
  googleLogout = () => {
    if (confirm("คุณต้องการออกจากระบบหรือไม่?")) {
      auth.signOut();
    }
  };

  componentDidMount() {
    // ตรวจสอบสถานะล็อกอิน
    auth.onAuthStateChanged((user) => {
      if (user) {
        this.setState({ user: user.toJSON() });
      } else {
        this.setState({ user: null });
      }
    });
  }

  title = (
    <Alert variant="info">
      <b>Work6 :</b> Firebase
    </Alert>
  );

  footer = (
    <div>
      By 653380199-3 Tanthai Orahunta <br />
      College of Computing, Khon Kaen University
    </div>
  );

  render() {
    return (
      <Card className="m-3">
        <Card.Header>{this.title}</Card.Header>

        {/* ปุ่ม Login / Logout */}
        <Card.Body className="text-center">
          {this.state.user ? (
            <>
              <img src={this.state.user.photoURL} width="50" alt="user" className="me-2 rounded-circle" />
              <span>{this.state.user.email}</span>
              <Button variant="danger" className="ms-3" onClick={this.googleLogout}>Logout</Button>
            </>
          ) : (
            <Button variant="primary" onClick={this.googleLogin}>Login with Google</Button>
          )}
        </Card.Body>

        {/* ปุ่ม CRUD */}
        <Card.Body>
          <Button variant="primary" className="me-2" onClick={this.readData}>
            Read Data
          </Button>
          <Button variant="info" onClick={this.autoRead}>
            Auto Read
          </Button>
        </Card.Body>

        {/* ตารางแสดงข้อมูล */}
        <Table striped bordered hover className="mt-3 text-center">
          <thead>
            <tr>
              <th>รหัส</th>
              <th>คำนำหน้า</th>
              <th>ชื่อ</th>
              <th>สกุล</th>
              <th>Email</th>
              <th>จัดการ</th>
            </tr>
          </thead>
          <tbody>
            {this.state.students.map((s) => (
              <tr key={s.id}>
                <td>{s.id}</td>
                <td>{s.title}</td>
                <td>{s.fname}</td>
                <td>{s.lname}</td>
                <td>{s.email}</td>
                <td>
                  <Button variant="warning" size="sm" className="me-2" onClick={() => this.edit(s)}>แก้ไข</Button>
                  <Button variant="danger" size="sm" onClick={() => this.deleteData(s)}>ลบ</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        {/* ฟอร์มเพิ่มข้อมูล */}
        <Card.Body>
          <h5 className="mb-3">เพิ่มนักศึกษา :</h5>
          <Form>
            <Row className="mb-3">
              <Col md={2}>
                <Form.Group>
                  <Form.Label>ID:</Form.Label>
                  <Form.Control type="text" value={this.state.stdid} onChange={(e) => this.setState({ stdid: e.target.value })} />
                </Form.Group>
              </Col>
              <Col md={2}>
                <Form.Group>
                  <Form.Label>คำนำหน้า:</Form.Label>
                  <Form.Control type="text" value={this.state.stdtitle} onChange={(e) => this.setState({ stdtitle: e.target.value })} />
                </Form.Group>
              </Col>
              <Col md={2}>
                <Form.Group>
                  <Form.Label>ชื่อ:</Form.Label>
                  <Form.Control type="text" value={this.state.stdfname} onChange={(e) => this.setState({ stdfname: e.target.value })} />
                </Form.Group>
              </Col>
              <Col md={2}>
                <Form.Group>
                  <Form.Label>สกุล:</Form.Label>
                  <Form.Control type="text" value={this.state.stdlname} onChange={(e) => this.setState({ stdlname: e.target.value })} />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group>
                  <Form.Label>Email:</Form.Label>
                  <Form.Control type="email" value={this.state.stdemail} onChange={(e) => this.setState({ stdemail: e.target.value })} />
                </Form.Group>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col md={3}>
                <Form.Group>
                  <Form.Label>Phone:</Form.Label>
                  <Form.Control type="text" value={this.state.stdphone} onChange={(e) => this.setState({ stdphone: e.target.value })} />
                </Form.Group>
              </Col>
              <Col md={2} className="d-flex align-items-end">
                <Button variant="success" onClick={this.insertData}>Save</Button>
              </Col>
            </Row>
          </Form>
        </Card.Body>

        <Card.Footer>{this.footer}</Card.Footer>
      </Card>
    );
  }
}

// เรนเดอร์ React ลงใน myapp
const container = document.getElementById("myapp");
ReactDOM.render(<App />, container);
