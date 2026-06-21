const jsonFile = require('jsonfile');

function parseCookieStr(str) {
  const userCookie = {};
  str.split('; ').filter(Boolean).forEach((c) => {
    const i = c.indexOf('=');
    if (i > 0) userCookie[c.slice(0, i)] = c.slice(i + 1);
  });
  if (Number(userCookie.login_type) === 2) {
    userCookie.uin = userCookie.wxuin;
  }
  userCookie.uin = (userCookie.uin || '').replace(/\D/g, '');
  return userCookie;
}

module.exports = () => {
  let allCookies = {};
  let userCookie = {};

  if (process.env.QQ_COOKIE?.trim()) {
    userCookie = parseCookieStr(process.env.QQ_COOKIE.trim());
  } else {
    try {
      userCookie = jsonFile.readFileSync('data/cookie.json');
    } catch (err) {
      // no cookie file
    }
  }

  try {
    allCookies = jsonFile.readFileSync('data/allCookies.json');
  } catch (err) {
    // no allCookies file
  }

  return {
    allCookies: () => allCookies,
    userCookie: () => userCookie,
    updateAllCookies: (v) => { allCookies = v; },
    updateUserCookie: (v) => { userCookie = v; },
  };
};
