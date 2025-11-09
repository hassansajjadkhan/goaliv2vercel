import { useEffect, useState } from 'react';
import { supabase } from '../../supabaseClient';
import { API_BASE_URL } from "../../config";

const CreateSeasonTicket = () => {
  const [form, setForm] = useState({
    title: '',
    description: '',
    price: '',
    event_ids: [],
  });
  const [events, setEvents] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUserAndEvents = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      if (!user) return;

      const { data: events } = await supabase
        .from('events')
        .select('id, title, date')
        .eq('team_id', user?.user_metadata?.team_id || '') // fallback
        .eq('status', 'published');

      setEvents(events || []);
    };

    fetchUserAndEvents();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleEventSelect = (e) => {
    const selected = Array.from(e.target.selectedOptions, opt => opt.value);
    setForm({ ...form, event_ids: selected });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return alert("Not logged in");

    const res = await fetch(`${API_BASE_URL}/api/season-tickets`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, created_by: user.id, price: parseFloat(form.price) })
    });

    const data = await res.json();
    if (res.ok) {
      alert("Season Ticket created!");
      setForm({ title: '', description: '', price: '', event_ids: [] });
    } else {
      alert(data.error || "Failed to create");
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-xl shadow-md mt-10">
      <h2 className="text-xl font-bold mb-4">Create Season Ticket</h2>
      <form onSubmit={handleSubmit} className="space-y-4">

        <input
          type="text"
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Season Title"
          className="w-full border px-4 py-2 rounded"
          required
        />

        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Description"
          className="w-full border px-4 py-2 rounded"
        />

        <input
          type="number"
          name="price"
          value={form.price}
          onChange={handleChange}
          placeholder="Price ($)"
          className="w-full border px-4 py-2 rounded"
          required
        />

        <label>Select Events:</label>
        <select multiple onChange={handleEventSelect} className="w-full border px-4 py-2 rounded h-32">
          {events.map(ev => (
            <option key={ev.id} value={ev.id}>
              {ev.title} - {new Date(ev.date).toLocaleDateString()}
            </option>
          ))}
        </select>

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          Create Season Ticket
        </button>
      </form>
    </div>
  );
};

export default CreateSeasonTicket;
