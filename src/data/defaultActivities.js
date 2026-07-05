// 预设的广州/上海吃喝玩乐数据
import { generateId } from '../services/storage';

export function createDefaultActivities() {
  return [
    // ===== 广州 =====
    // 美食
    { id: generateId(), category: 'food', name: '点都德', description: '老字号早茶，虾饺、红米肠必点', city: '广州', location: null, isUserAdded: false },
    { id: generateId(), category: 'food', name: '陶陶居', description: '百年老店，烧鹅和叉烧酥一绝', city: '广州', location: null, isUserAdded: false },
    { id: generateId(), category: 'food', name: '广州酒家', description: '文昌鸡、莲蓉包，地道粤菜', city: '广州', location: null, isUserAdded: false },
    { id: generateId(), category: 'food', name: '银记肠粉', description: '广州最出名的肠粉店，皮薄馅多', city: '广州', location: null, isUserAdded: false },
    { id: generateId(), category: 'food', name: '惠食佳', description: '米其林推荐啫啫煲，黄鳝煲仔饭', city: '广州', location: null, isUserAdded: false },
    { id: generateId(), category: 'food', name: '南信牛奶甜品', description: '双皮奶、姜撞奶，老广甜品', city: '广州', location: null, isUserAdded: false },
    { id: generateId(), category: 'food', name: '陈添记鱼皮', description: '上下九老字号凉拌鱼皮', city: '广州', location: null, isUserAdded: false },
    // 景点
    { id: generateId(), category: 'attraction', name: '广州塔', description: '600米地标，登塔俯瞰珠江新城', city: '广州', location: { lat: 23.1063, lng: 113.3245 }, isUserAdded: false },
    { id: generateId(), category: 'attraction', name: '沙面岛', description: '欧陆风情建筑群，拍照圣地', city: '广州', location: { lat: 23.1099, lng: 113.2448 }, isUserAdded: false },
    { id: generateId(), category: 'attraction', name: '陈家祠', description: '岭南建筑艺术明珠，木雕石雕精美', city: '广州', location: { lat: 23.1291, lng: 113.2487 }, isUserAdded: false },
    { id: generateId(), category: 'attraction', name: '白云山', description: '羊城第一秀，登高望远', city: '广州', location: { lat: 23.1698, lng: 113.2960 }, isUserAdded: false },
    { id: generateId(), category: 'attraction', name: '永庆坊', description: '西关风情文创街区，李小龙故居', city: '广州', location: { lat: 23.1170, lng: 113.2419 }, isUserAdded: false },
    { id: generateId(), category: 'attraction', name: '长隆野生动物世界', description: '亚洲最大野生动物园', city: '广州', location: { lat: 23.0102, lng: 113.3222 }, isUserAdded: false },
    // 娱乐购物
    { id: generateId(), category: 'play', name: '珠江夜游', description: '乘船夜游珠江，看广州夜景', city: '广州', location: null, isUserAdded: false },
    { id: generateId(), category: 'play', name: '太古汇', description: '天河奢侈品购物中心', city: '广州', location: { lat: 23.1346, lng: 113.3311 }, isUserAdded: false },
    { id: generateId(), category: 'play', name: '北京路步行街', description: '千年古道商业街，小吃购物一体', city: '广州', location: { lat: 23.1247, lng: 113.2696 }, isUserAdded: false },
    { id: generateId(), category: 'drink', name: '喜茶 LAB', description: '天环广场喜茶旗舰店，限定饮品', city: '广州', location: null, isUserAdded: false },
    { id: generateId(), category: 'drink', name: '庙前冰室', description: '亚洲50佳酒吧，藏在冰室后面', city: '广州', location: null, isUserAdded: false },
    // 交通
    { id: generateId(), category: 'transport', name: '广州地铁', description: '覆盖全城，微信小程序扫码乘车', city: '广州', location: null, isUserAdded: false },
    { id: generateId(), category: 'transport', name: '广州南站', description: '高铁枢纽，可直达深圳/珠海/香港', city: '广州', location: { lat: 22.9905, lng: 113.2690 }, isUserAdded: false },
    { id: generateId(), category: 'transport', name: '白云机场', description: '广州白云国际机场，地铁3号线直达', city: '广州', location: { lat: 23.3924, lng: 113.3090 }, isUserAdded: false },

    // ===== 上海 =====
    // 美食
    { id: generateId(), category: 'food', name: '南翔馒头店', description: '豫园老字号小笼包', city: '上海', location: null, isUserAdded: false },
    { id: generateId(), category: 'food', name: '大壶春', description: '上海生煎包天花板，肉馅多汁', city: '上海', location: null, isUserAdded: false },
    { id: generateId(), category: 'food', name: '光明邨', description: '排队王鲜肉月饼、酱鸭', city: '上海', location: null, isUserAdded: false },
    { id: generateId(), category: 'food', name: '老正兴', description: '百年本帮菜，红烧肉、草头圈子', city: '上海', location: null, isUserAdded: false },
    { id: generateId(), category: 'food', name: '佳家汤包', description: '现包现蒸小笼，蟹粉汤包', city: '上海', location: null, isUserAdded: false },
    { id: generateId(), category: 'food', name: '红宝石', description: '奶油小方蛋糕，上海人童年回忆', city: '上海', location: null, isUserAdded: false },
    // 景点
    { id: generateId(), category: 'attraction', name: '外滩', description: '万国建筑博览群，浦江对望陆家嘴', city: '上海', location: { lat: 31.2400, lng: 121.4907 }, isUserAdded: false },
    { id: generateId(), category: 'attraction', name: '豫园', description: '明代江南园林，九曲桥湖心亭', city: '上海', location: { lat: 31.2277, lng: 121.4925 }, isUserAdded: false },
    { id: generateId(), category: 'attraction', name: '迪士尼乐园', description: '中国大陆首座迪士尼', city: '上海', location: { lat: 31.1443, lng: 121.6603 }, isUserAdded: false },
    { id: generateId(), category: 'attraction', name: '武康路', description: '梧桐树下漫步，老洋房咖啡馆', city: '上海', location: { lat: 31.2074, lng: 121.4396 }, isUserAdded: false },
    { id: generateId(), category: 'attraction', name: '上海博物馆', description: '免费顶级博物馆，青铜陶瓷馆藏丰富', city: '上海', location: { lat: 31.2302, lng: 121.4744 }, isUserAdded: false },
    { id: generateId(), category: 'attraction', name: '田子坊', description: '石库门里弄创意集市', city: '上海', location: { lat: 31.2086, lng: 121.4690 }, isUserAdded: false },
    // 娱乐购物
    { id: generateId(), category: 'play', name: '南京路步行街', description: '中华商业第一街', city: '上海', location: { lat: 31.2365, lng: 121.4778 }, isUserAdded: false },
    { id: generateId(), category: 'play', name: '新天地', description: '石库门里的时尚餐饮酒吧区', city: '上海', location: { lat: 31.2194, lng: 121.4763 }, isUserAdded: false },
    { id: generateId(), category: 'drink', name: 'Speak Low', description: '亚洲50佳酒吧，隐藏书店后的秘密', city: '上海', location: null, isUserAdded: false },
    { id: generateId(), category: 'drink', name: '%Arabica', description: '武康路网红咖啡，适合拍照', city: '上海', location: null, isUserAdded: false },
    // 交通
    { id: generateId(), category: 'transport', name: '上海地铁', description: 'Metro大都会APP扫码乘车，覆盖全市', city: '上海', location: null, isUserAdded: false },
    { id: generateId(), category: 'transport', name: '虹桥枢纽', description: '高铁+机场一体，地铁2/10号线', city: '上海', location: { lat: 31.1943, lng: 121.3200 }, isUserAdded: false },
    { id: generateId(), category: 'transport', name: '浦东机场', description: '上海浦东国际机场，磁悬浮直达', city: '上海', location: { lat: 31.1443, lng: 121.8083 }, isUserAdded: false },
  ];
}
