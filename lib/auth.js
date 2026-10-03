const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookie = require('cookie');

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-cambia-questo-in-produzione';
const COOKIE_NAME = 'traveltrip_session';
const SESSION_DAYS = 30;

function hashPassword(password) {
  return bcrypt.hash(password, 10);
}

function verifyPassword(password, hash) {
  return bcrypt.compare(password, hash);
}

function createSessionToken(userId) {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: `${SESSION_DAYS}d` });
}

function verifySessionToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (e) {
    return null;
  }
}

function setSessionCookie(res, token) {
  const serialized = cookie.serialize(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: SESSION_DAYS * 24 * 60 * 60,
    path: '/',
  });
  res.setHeader('Set-Cookie', serialized);
}

function clearSessionCookie(res) {
  const serialized = cookie.serialize(COOKIE_NAME, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 0,
    path: '/',
  });
  res.setHeader('Set-Cookie', serialized);
}

function getUserIdFromRequest(req) {
  const cookies = cookie.parse(req.headers.cookie || '');
  const token = cookies[COOKIE_NAME];
  if (!token) return null;
  const payload = verifySessionToken(token);
  return payload ? payload.userId : null;
}

function generateVerificationCode() {
  // Codice numerico a 6 cifre, valido per 15 minuti
  return Math.floor(100000 + Math.random() * 900000).toString();
}

module.exports = {
  hashPassword,
  verifyPassword,
  createSessionToken,
  verifySessionToken,
  setSessionCookie,
  clearSessionCookie,
  getUserIdFromRequest,
  generateVerificationCode,
  COOKIE_NAME,
};
