import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { formatDistanceToNow } from 'date-fns';

const CommentSection = ({ productId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [replyTo, setReplyTo] = useState(null);
  const [replyText, setReplyText] = useState('');

  const currentUser = JSON.parse(localStorage.getItem('user') || 'null');
  const token = localStorage.getItem('token');
  const loadComments = async () => {
    try {
      const res = await axios.get(`/api/comments/${productId}`);
      setComments(res.data); 
    } catch (err) {
      console.error('Load comment lỗi:', err);
    }
  };
  useEffect(() => {
    loadComments();
  }, [productId]);
  // Đăng comment / reply
  const post = async (content, parentId = null) => {
    try {
      const res = await axios.post(
        `/api/comments/${productId}`,
        { content, parentId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (!parentId) {
        setComments([res.data, ...comments]);
        setNewComment('');
      } else {
        loadComments(); // reply thì reload cho chắc
        setReplyText('');
        setReplyTo(null);
      }
    } catch (err) {
      alert('Đăng không thành công');
    }
  };
  const like = async (commentId) => {
    try {
      await axios.patch(
        `/api/comments/${commentId}/like`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      loadComments();
    } catch (err) {
      console.error(err);
    }
  };
  const CommentItem = ({ c, depth = 0 }) => (
    <div className={`${depth > 0 ? 'ml-8 mt-4 border-l-2 border-gray-200 pl-4' : 'mt-6'}`}>
      <div className="flex gap-3">
        <img
          src={c.userAvatar || 'https://via.placeholder.com/40'}
          alt={c.userName}
          className="w-10 h-10 rounded-full object-cover"
        />
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="font-semibold">{c.userName}</span>
            <span className="text-xs text-gray-500">
              {formatDistanceToNow(new Date(c.createdAt), { addSuffix: true })}
            </span>
          </div>
          <p className="mt-1 text-gray-800">{c.content}</p>

          <div className="flex gap-5 mt-2 text-sm">
            <button onClick={() => like(c._id)} className="text-blue-600 hover:underline">
              Like {c.likes.length > 0 && `(${c.likes.length})`}
            </button>
            <button onClick={() => setReplyTo(replyTo === c._id ? null : c._id)} className="text-gray-600 hover:underline">
              Reply
            </button>
          </div>

          {/* Ô reply */}
          {replyTo === c._id && (
            <div className="mt-3 flex gap-2">
              <input
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && post(replyText, c._id)}
                placeholder="Viết trả lời..."
                className="flex-1 px-3 py-2 border rounded-lg text-sm"
              />
              <button
                onClick={() => post(replyText, c._id)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
              >
                Gửi
              </button>
            </div>
          )}

          {/* Render replies */}
          {c.replies?.map(r => (
            <CommentItem key={r._id} c={r} depth={depth + 1} />
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="mt-12 border-t pt-8">
      <h2 className="text-2xl font-bold mb-6">Bình luận</h2>

      {/* Form đăng bình luận chính */}
      {currentUser ? (
        <div className="flex gap-4 mb-8">
          <img
            src={currentUser.avatar}
            alt=""
            className="w-12 h-12 rounded-full"
          />
          <div className="flex-1">
            <textarea
              rows="3"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Bạn nghĩ gì về món này?"
              className="w-full px-4 py-3 border rounded-lg resize-none focus:ring-2 focus:ring-orange-500"
            />
            <div className="mt-2 text-right">
              <button
                onClick={() => post(newComment)}
                disabled={!newComment.trim()}
                className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50"
              >
                Đăng bình luận
              </button>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-center py-8 text-gray-500">
          Hãy <a href="/login" className="text-blue-600 underline">đăng nhập</a> để bình luận
        </p>
      )}

      {/* Danh sách comment */}
     {(!Array.isArray(comments) || comments.length === 0) ? (
  <p className="text-center py-8 text-gray-500">
    Chưa có bình luận nào. Hãy là người đầu tiên!
  </p>
) : (
  comments.map(c => <CommentItem key={c._id} c={c} />)
)}
    </div>
  );
};

export default CommentSection;