import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import './App.css';

const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:5001/api/students';

function App() {
  const [students, setStudents] = useState([]);
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [stuClass, setStuClass] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortAsc, setSortAsc] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get(API_BASE);
      setStudents(response.data);
    } catch (err) {
      setError('Không thể tải danh sách học sinh.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setName('');
    setAge('');
    setStuClass('');
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !stuClass.trim() || !age) return;

    const payload = { name: name.trim(), age: Number(age), class: stuClass.trim() };

    try {
      setLoading(true);
      setError('');
      if (editingId) {
        // Bài 3: Cập nhật học sinh
        const { data } = await axios.put(`${API_BASE}/${editingId}`, payload);
        setStudents((prev) => prev.map((stu) => (stu._id === editingId ? data : stu)));
      } else {
        // Bài 2: Thêm học sinh mới
        const { data } = await axios.post(API_BASE, payload);
        setStudents((prev) => [...prev, data]);
      }
      resetForm();
    } catch (err) {
      setError('Có lỗi khi lưu dữ liệu.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (student) => {
    setEditingId(student._id);
    setName(student.name || '');
    setAge(student.age || '');
    setStuClass(student.class || '');
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bạn có chắc muốn xóa học sinh này?')) return;
    try {
      setLoading(true);
      setError('');
      // Bài 4: Xóa học sinh
      await axios.delete(`${API_BASE}/${id}`);
      setStudents((prev) => prev.filter((stu) => stu._id !== id));
    } catch (err) {
      setError('Có lỗi khi xóa học sinh.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Bài 5: Tìm kiếm theo tên
  const filteredStudents = useMemo(() => {
    const keyword = searchTerm.trim().toLowerCase();
    if (!keyword) return students;
    return students.filter((s) => s.name.toLowerCase().includes(keyword));
  }, [students, searchTerm]);

  // Bài 6: Sắp xếp theo tên
  const sortedStudents = useMemo(() => {
    return [...filteredStudents].sort((a, b) => {
      const nameA = a.name || '';
      const nameB = b.name || '';
      // Dùng localeCompare để so sánh đầy đủ họ + tên đệm + tên (bỏ phân biệt hoa thường, dấu)
      const result = nameA.localeCompare(nameB, 'vi', {
        sensitivity: 'base',
        ignorePunctuation: true,
      });
      if (result === 0) return 0;
      return sortAsc ? result : -result;
    });
  }, [filteredStudents, sortAsc]);

  return (
    <div className="app">
      <header>
        <h1>Quản lý học sinh</h1>
        <p>CRUD cơ bản với React + Express + MongoDB</p>
      </header>

      <section className="card">
        <h2>{editingId ? 'Sửa thông tin học sinh' : 'Thêm học sinh mới'}</h2>
        <form className="form" onSubmit={handleSubmit}>
          <div className="form-row">
            <label htmlFor="name">Họ tên</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nguyễn Văn A"
              required
            />
          </div>
          <div className="form-row">
            <label htmlFor="age">Tuổi</label>
            <input
              id="age"
              type="number"
              min="1"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="18"
              required
            />
          </div>
          <div className="form-row">
            <label htmlFor="class">Lớp</label>
            <input
              id="class"
              type="text"
              value={stuClass}
              onChange={(e) => setStuClass(e.target.value)}
              placeholder="12A1"
              required
            />
          </div>
          <div className="form-actions">
            <button type="submit" disabled={loading}>
              {editingId ? 'Lưu thay đổi' : 'Thêm học sinh'}
            </button>
            {editingId && (
              <button type="button" className="secondary" onClick={resetForm}>
                Hủy
              </button>
            )}
          </div>
        </form>
      </section>

      <section className="card">
        <div className="toolbar">
          <div className="search">
            <input
              type="text"
              placeholder="Tìm kiếm theo tên..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="secondary" onClick={() => setSortAsc((prev) => !prev)}>
            Sắp xếp theo tên: {sortAsc ? 'A → Z' : 'Z → A'}
          </button>
        </div>

        {error && <div className="error">{error}</div>}
        {loading && <div className="info">Đang xử lý...</div>}

        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Họ tên</th>
                <th>Tuổi</th>
                <th>Lớp</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {sortedStudents.length === 0 ? (
                <tr>
                  <td colSpan="4" className="empty">
                    Chưa có học sinh nào
                  </td>
                </tr>
              ) : (
                sortedStudents.map((student) => (
                  <tr key={student._id}>
                    <td>{student.name}</td>
                    <td>{student.age}</td>
                    <td>{student.class}</td>
                    <td className="actions">
                      <button onClick={() => handleEdit(student)}>Sửa</button>
                      <button className="danger" onClick={() => handleDelete(student._id)}>
                        Xóa
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

export default App;
