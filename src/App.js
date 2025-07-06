import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const translations = {
  en: {
    title: 'Unaccompanied Minors in France',
    shareStory: 'Share your story...',
    post: 'Post',
    comments: 'Comments:',
    commentPlaceholder: 'Write a comment and press Enter...',
    welcome: "Sending your child away in search of a better future, safety, healthcare, education is one of the hardest choices a parent can make. Many of us here at the LAO Red Cross came to France with hope, but without any understanding of what would happen next.",
    info: "This website is not a legal guide. It’s not a promise or a warning. It’s a collection of real stories shared by young people like me, living as unaccompanied minors in France. What you’ll read here are just a few of the many paths a young person’s life can take. Every story is different. But I believe it’s important that you, as a parent, see one possible version of what life here might be like for your child. If you are also living this experience or lived it before and want to share your story, you can do it anonymously on this website in any language you feel comfortable using. Your story matters."
  },
  fr: {
    title: 'Mineurs Non Accompagnés en France',
    shareStory: 'Partagez votre histoire...',
    post: 'Publier',
    comments: 'Commentaires :',
    commentPlaceholder: 'Écrivez un commentaire et appuyez sur Entrée...',
    welcome: "Envoyer votre enfant loin à la recherche d’un avenir meilleur, de la sécurité, des soins de santé, de l’éducation est l’un des choix les plus difficiles qu’un parent puisse faire. Beaucoup d’entre nous ici à la Croix-Rouge LAO sommes venus en France avec espoir, mais sans aucune compréhension de ce qui allait se passer ensuite.",
    info: "Ce site n’est pas un guide juridique. Ce n’est pas une promesse ni un avertissement. C’est une collection d’histoires vraies partagées par des jeunes comme moi, vivant comme mineurs non accompagnés en France. Ce que vous lirez ici n’est qu’une petite partie des nombreux chemins que la vie d’un jeune peut prendre. Chaque histoire est différente. Mais je crois qu’il est important que vous, en tant que parent, voyiez une version possible de ce que la vie ici pourrait être pour votre enfant. Si vous vivez aussi cette expérience ou l’avez vécue auparavant et que vous souhaitez partager votre histoire, vous pouvez le faire anonymement sur ce site dans la langue dans laquelle vous êtes à l’aise. Votre histoire compte."
  },
  ar: {
    title: 'الأحداث غير المصحوبين في فرنسا',
    shareStory: 'شارك قصتك...',
    post: 'انشر',
    comments: 'التعليقات:',
    commentPlaceholder: 'اكتب تعليقًا واضغط Enter...',
    welcome: "إرسال طفلك بعيدًا بحثًا عن مستقبل أفضل، الأمان، الرعاية الصحية، التعليم هو واحد من أصعب القرارات التي يمكن أن يتخذها الأهل. كثير منا هنا في الصليب الأحمر LAO جاؤوا إلى فرنسا بالأمل، ولكن بدون أي فهم لما سيحدث بعد ذلك.",
    info: "هذا الموقع ليس دليلًا قانونيًا. إنه ليس وعدًا أو تحذيرًا. إنه مجموعة من القصص الحقيقية التي يشاركها شباب مثلي يعيشون كأحداث غير مصحوبين في فرنسا. ما ستقرأه هنا هو مجرد عدد قليل من المسارات التي يمكن أن تأخذها حياة الشاب. كل قصة مختلفة. لكنني أعتقد أنه من المهم أن ترى أنت، كوالد، نسخة ممكنة من كيف يمكن أن تكون الحياة هنا لطفلك. إذا كنت تعيش هذه التجربة أو عشتها من قبل وترغب في مشاركة قصتك، يمكنك القيام بذلك بشكل مجهول على هذا الموقع بأي لغة تشعر بالراحة في استخدامها. قصتك مهمة."
  },
  bm: { // Bambara
    title: 'Minors Fɔlɔw ka tɔgɔ ko France',
    shareStory: 'Kɛw ka fɔ ko...',
    post: 'Fɔlɔ',
    comments: 'Kan',
    commentPlaceholder: 'Kyerɛ kan ka kɔ Enter...',
    welcome: "I ni ce. Kani kɛɛbɛ fɛ ka kɔ France fɛɛrɛ kɔ ko ni i ye — ni mama ni baba be taa i kɛ ko.",
    info: "I be taa hɛrɛw ka fɔli, sigi, ani fan fɛɛrɛ bɛɛ bɛɛ min ye kɛɛbɛ fɔlɔw ye. I be bɛɛ kɔrɔ."
  },
  uk: {
    title: 'Неповнолітні без супроводу у Франції',
    shareStory: 'Поділіться своєю історією...',
    post: 'Опублікувати',
    comments: 'Коментарі:',
    commentPlaceholder: 'Напишіть коментар і натисніть Enter...',
    welcome: "Відправити свою дитину на пошуки кращого майбутнього, безпеки, охорони здоров'я, освіти — одне з найважчих рішень, які може прийняти батько чи мати. Багато з нас тут, у Червоному Хресті ЛАО, приїхали до Франції з надією, але без розуміння того, що станеться далі.",
    info: "Цей сайт не є юридичним посібником. Це не обіцянка чи попередження. Це збірка реальних історій, якими діляться молоді люди, які живуть як неповнолітні без супроводу у Франції. Те, що ви прочитаєте тут — це лише кілька шляхів, якими може піти життя молодої людини. Кожна історія різна. Але я вважаю, що важливо, щоб ви, як батько чи мати, побачили одну можливу версію того, яким може бути життя тут для вашої дитини. Якщо ви також переживаєте цей досвід або переживали його раніше і хочете поділитися своєю історією, ви можете зробити це анонімно на цьому сайті будь-якою мовою, якою ви відчуваєте комфорт. Ваша історія важлива."
  }
};

function App() {
  const [language, setLanguage] = useState('en');
  const [text, setText] = useState('');
  const [image, setImage] = useState(null);
  const [posts, setPosts] = useState([]);

  const t = translations[language];

  const fetchPosts = async () => {
    try {
      const res = await axios.get('http://localhost:5000/posts');
      setPosts(res.data);
    } catch (error) {
      console.error('Error loading posts:', error);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handlePost = async () => {
    if (!text && !image) return;

    const formData = new FormData();
    formData.append('text', text);
    if (image) formData.append('image', image);

    try {
      await axios.post('http://localhost:5000/posts', formData);
      setText('');
      setImage(null);
      fetchPosts();
    } catch (error) {
      console.error('Error posting:', error);
    }
  };

  const handleComment = async (postId, commentText) => {
    if (!commentText) return;

    try {
      await axios.post(`http://localhost:5000/posts/${postId}/comment`, { comment: commentText });
      fetchPosts();
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  return (
    <div className="App" style={{ padding: '20px', maxWidth: '600px', margin: 'auto' }}>
      {/* Language Buttons */}
      <div style={{ marginBottom: '20px', textAlign: 'center' }}>
        <button onClick={() => setLanguage('en')} disabled={language === 'en'}>English</button>{' '}
        <button onClick={() => setLanguage('fr')} disabled={language === 'fr'}>Français</button>{' '}
        <button onClick={() => setLanguage('ar')} disabled={language === 'ar'}>العربية</button>{' '}
        <button onClick={() => setLanguage('bm')} disabled={language === 'bm'}>Bambara</button>{' '}
        <button onClick={() => setLanguage('uk')} disabled={language === 'uk'}>Українська</button>
      </div>

      <h1>{t.title}</h1>

      <p style={{ whiteSpace: 'pre-line' }}>{t.welcome}</p>
      <p style={{ whiteSpace: 'pre-line', marginBottom: '30px' }}>{t.info}</p>

      <textarea
        placeholder={t.shareStory}
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={4}
        style={{ width: '100%', marginBottom: '10px' }}
      />

      <input
        type="file"
        accept="image/*"
        onChange={(e) => setImage(e.target.files[0])}
        style={{ marginBottom: '10px' }}
      />
      <br />

      <button onClick={handlePost}>{t.post}</button>

      <div style={{ marginTop: '30px' }}>
        {posts.map((post, index) => (
          <div key={index} style={{ border: '1px solid #ccc', padding: '15px', marginBottom: '20px' }}>
            <p>{post.text}</p>
            {post.image && <img src={`http://localhost:5000${post.image}`} alt="Post" style={{ maxWidth: '100%' }} />}

            <div style={{ marginTop: '10px' }}>
              <strong>{t.comments}</strong>
              <ul>
                {post.comments.map((c, i) => (
                  <li key={i}>{c}</li>
                ))}
              </ul>

              <input
                type="text"
                placeholder={t.commentPlaceholder}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleComment(post._id, e.target.value);
                    e.target.value = '';
                  }
                }}
                style={{ width: '100%', padding: '8px' }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;