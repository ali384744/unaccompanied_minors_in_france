import React, { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [posts, setPosts] = useState([]);
  const [text, setText] = useState('');
  const [image, setImage] = useState(null);
  const [comment, setComment] = useState('');
  const [commentingPostId, setCommentingPostId] = useState(null);
  const [language, setLanguage] = useState('en');

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  const introTexts = {
    en: `Sending your child alone to another continent in hopes of a better future is one of the most difficult decisions a parent can make. This website does not offer legal guidance. It shares stories from young people who arrived in France as unaccompanied minors. These stories show just one possible path a young person’s life might take, but I believe it is important for you as a parent to understand what your child’s life could be like before making your decision. If you are an unaccompanied minor or have gone through this experience, you can share your story anonymously on this website. Every voice matters and can help prepare other minors for what lies ahead, as well as supporting families facing this decision.`,
    fr: `Envoyer votre enfant seul sur un autre continent dans l’espoir d’un avenir meilleur est l’une des décisions les plus difficiles qu’un parent puisse prendre. Ce site ne propose pas de conseils juridiques. Il partage des témoignages de jeunes arrivés en France en tant que mineurs non accompagnés. Ces récits montrent un chemin possible, mais il est important, en tant que parent, de comprendre à quoi pourrait ressembler la vie de votre enfant avant de prendre votre décision. Si vous êtes un mineur non accompagné ou avez vécu cette expérience, vous pouvez partager votre histoire anonymement ici. Chaque voix compte.`,
    bm: `K’a t’a fanga ka du kuma ka kɛ b’a fɛ a la den be taa Amerikɔ kɔfɛ ɲɛmɔgɔya ni kɛnɛya ni kalan ye, o ye ka bɔnbɔya dɛmɛ kɛ. Sitelu ye jurimuso ye. O bɛ sara don yera minɛ bɛ baa France kɔ sɛbɛn na dɔnkiliya la. O fɔlɔ ye dɔ ye, n’i taa, i bɛ fo a fɔlɔ ye i yɛrɛ la. Sɔ̀rɔ ka i ka dɔnkili don, a bɛ fɔ i tɛ sisan ka i fɔ i ɲinɛ ye dɔ. I tɛ ka ka dɔnkili dɔ bɛɛ la sisan ka sara sisan ni ɲɔgɔn dɔ kɛ.`,
    ar: `إرسال طفلك بمفرده إلى قارة أخرى على أمل مستقبل أفضل هو من أصعب القرارات التي يمكن أن يتخذها أي والد. هذا الموقع لا يقدم إرشادات قانونية. إنه يشارك قصصًا لشباب وصلوا إلى فرنسا كقاصرين غير مصحوبين. هذه القصص توضح فقط أحد المسارات الممكنة التي قد يتخذها الشاب، ولكن من المهم أن تفهم كوالد كيف يمكن أن تبدو حياة طفلك قبل اتخاذ قرارك. إذا كنت قاصرًا غير مصحوب أو مررت بهذه التجربة، يمكنك مشاركة قصتك بشكل مجهول على هذا الموقع. كل صوت مهم.`,
    uk: `Відправити дитину на інший континент у пошуках кращого майбутнього — одне з найважчих рішень для батьків. Цей вебсайт не надає юридичних порад. Тут публікуються історії молоді, яка приїхала до Франції як неповнолітні без супроводу. Ці історії показують лише один можливий шлях, яким може піти життя молодої людини, але важливо, щоб батьки зрозуміли, яким може бути життя їхньої дитини, перш ніж приймати рішення. Якщо ви неповнолітній без супроводу або пройшли через це — поділіться своєю історією анонімно. Кожен голос має значення.`,
    ps: `ستاسو د ماشوم د ښه راتلونکي لپاره یو بل وچ ته یوازې لیږل یو له تر ټولو سختو پرېکړو څخه دی چې یو والدین یې کولی شي. دا ویب‌پاڼه قانوني مشوره نه وړاندې کوي، بلکې د هغو ځوانانو کیسې شریکوي چې د بې سرپرسته کوچنیانو په توګه فرانسې ته رسیدلي. دغه کیسې یوازې یوه ممکنه لاره ښيي، خو مهمه ده چې تاسو د یوه والد په توګه پوه شئ چې د ماشوم ژوند ممکن څنګه وي. که تاسو هم بې سرپرسته ماینر یاست یا تېر شوي یاست، کولای شئ خپله کیسه په پټه توګه دلته شریکه کړئ. هر غږ اهمیت لري.`,
    fa: `فرستادن فرزندتان به تنهایی به قاره‌ای دیگر به امید آینده‌ای بهتر یکی از سخت‌ترین تصمیماتی است که والدین می‌توانند بگیرند. این وبسایت مشاوره حقوقی ارائه نمی‌دهد. در عوض، داستان‌هایی از جوانانی که به عنوان نوجوانان بدون همراه وارد فرانسه شده‌اند، به اشتراک گذاشته می‌شود. این داستان‌ها تنها یک مسیر ممکن را نشان می‌دهند، اما مهم است که شما به عنوان والد بدانید ممکن است زندگی فرزندتان چگونه باشد. اگر شما هم نوجوانی بدون همراه هستید یا بوده‌اید، می‌توانید داستان خود را به صورت ناشناس در اینجا به اشتراک بگذارید. هر صدا مهم است.`,
  };

  const fetchPosts = async () => {
    try {
      const res = await fetch(`${API_URL}/posts`);
      const data = await res.json();
      setPosts(data);
    } catch (err) {
      console.error('Error fetching posts:', err);
    }
  };

  useEffect(() => {
  fetchPosts();
}, [fetchPosts]);


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim() && !image) return;

    const formData = new FormData();
    formData.append('text', text);
    if (image) formData.append('image', image);

    try {
      await fetch(`${API_URL}/posts`, {
        method: 'POST',
        body: formData,
      });
      setText('');
      setImage(null);
      await fetchPosts();
    } catch (err) {
      console.error('Error submitting post:', err);
    }
  };

  const handleComment = async (postId) => {
    if (!comment.trim()) return;
    try {
      await fetch(`${API_URL}/posts/${postId}/comment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ comment }),
      });
      setComment('');
      setCommentingPostId(null);
      await fetchPosts();
    } catch (err) {
      console.error('Error posting comment:', err);
    }
  };

  const handleDelete = async (postId) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    try {
      await fetch(`${API_URL}/posts/${postId}`, {
        method: 'DELETE',
      });
      await fetchPosts();
    } catch (err) {
      console.error('Error deleting post:', err);
    }
  };

  return (
    <div className="App">
      <h1>Unaccompanied Minors in France</h1>

      <div className="language-buttons" style={{ marginBottom: '1rem' }}>
        <button onClick={() => setLanguage('en')} disabled={language === 'en'}>English</button>
        <button onClick={() => setLanguage('fr')} disabled={language === 'fr'}>Français</button>
        <button onClick={() => setLanguage('bm')} disabled={language === 'bm'}>Bambara</button>
        <button onClick={() => setLanguage('ar')} disabled={language === 'ar'}>العربية</button>
        <button onClick={() => setLanguage('uk')} disabled={language === 'uk'}>Українська</button>
        <button onClick={() => setLanguage('ps')} disabled={language === 'ps'}>پښتو</button>
        <button onClick={() => setLanguage('fa')} disabled={language === 'fa'}>دری</button>
      </div>

      <div className="intro-text" style={{ whiteSpace: 'pre-line', marginBottom: '2rem' }}>
        <p>{introTexts[language]}</p>
      </div>

      <hr />

      <form onSubmit={handleSubmit} style={{ marginBottom: '2rem' }}>
        <textarea
          placeholder="Write your post..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={4}
          style={{ width: '100%', marginBottom: '0.5rem' }}
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
          style={{ marginBottom: '0.5rem' }}
        />
        <br />
        <button type="submit">Post</button>
      </form>

      {posts.map((post) => (
        <div key={post._id} className="post" style={{ marginBottom: '1.5rem' }}>
          <p>{post.text}</p>
          {post.image && (
            <img
              src={`${API_URL}${post.image}`}
              alt="Post"
              style={{ maxWidth: '300px', display: 'block', marginBottom: '0.5rem' }}
            />
          )}

          <div className="comments" style={{ marginLeft: '1rem' }}>
            <h4>Comments:</h4>
            {post.comments.length === 0 && <p>No comments yet.</p>}
            {post.comments.map((c, i) => (
              <p key={i}>• {c}</p>
            ))}

            {commentingPostId === post._id ? (
              <>
                <input
                  type="text"
                  placeholder="Your comment..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  style={{ marginRight: '0.5rem' }}
                />
                <button onClick={() => handleComment(post._id)}>Submit</button>
                <button
                  onClick={() => {
                    setCommentingPostId(null);
                    setComment('');
                  }}
                  style={{ marginLeft: '0.5rem' }}
                >
                  Cancel
                </button>
              </>
            ) : (
              <button onClick={() => setCommentingPostId(post._id)}>Comment</button>
            )}
          </div>

          <button
            onClick={() => handleDelete(post._id)}
            style={{
              marginTop: '0.5rem',
              backgroundColor: 'white',
              color: 'black',
              border: '1px solid black',
              padding: '0.4rem 0.8rem',
              borderRadius: '5px',
              cursor: 'pointer',
            }}
          >
            Delete
          </button>

          <hr />
        </div>
      ))}
    </div>
  );
}

export default App;
