const userService = require('../services/userService');

const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const getAllUsers = async (req, res) => {
  try {
    const users = await userService.getAllUsers();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los usuarios', error: error.message });
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await userService.getUserById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: `Usuario con ID: ${req.params.id} no encontrado` });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el usuario', error: error.message });
  }
};

const createUser = async (req, res) => {
  const { nombreCompleto, email, password, RFC, direccion, zipCode, telefono, metodoPagoPreferido, facturapi } = req.body;
  if (!nombreCompleto ||!email ||!password ||!RFC ||!direccion ||!zipCode ||!telefono ||!metodoPagoPreferido) {
    return res.status(400).json({ message: 'Todos los campos son obligatorios.' });
  }
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'El correo electrónico ya está registrado' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await userService.createUser({nombreCompleto,email,password: hashedPassword,RFC,direccion,zipCode,telefono,metodoPagoPreferido,facturapi});
    res.status(201).json({ message: 'Usuario creado exitosamente', newUser });
  } catch (error) {
    res.status(400).json({ message: 'Error al crear el usuario', error: error.message });
  }
};

const updateUser = async (req, res) => {
  const { nombreCompleto, email, password, RFC, direccion, zipCode, telefono, metodoPagoPreferido, facturapi } = req.body;

  try {
    const {id} = req.params;
    const hashedPassword = password ? await bcrypt.hash(password, 10) : undefined;
    const updatedUser = await userService.updateUser(id,{ nombreCompleto, email, password: hashedPassword, RFC, direccion, zipCode, telefono, metodoPagoPreferido, facturapi });
    if (!updatedUser) {
      return res.status(404).json({ message: `Usuario con ID: ${id} no encontrado` });
    }
    res.status(200).json({ message: 'Usuario actualizado exitosamente', updatedUser });
  } catch (error) {
    res.status(400).json({ message: 'Error al actualizar el usuario', error: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const {id} = req.params;
    const deletedUser = await userService.deleteUser(id);
    if (!deletedUser) {
      return res.status(404).json({ message: `Usuario con ID: ${id} no encontrado` });
    }
    res.status(200).json({ message: 'Usuario eliminado exitosamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar el usuario', error: error.message });
  }
};

// Login de usuario
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: `Usuario con ID: ${id} no encontrado` });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Contraseña incorrecta' });
    }
    const token = jwt.sign({ userId: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ token, user });
  } catch (error) {
    res.status(500).json({ message: 'Error al iniciar sesión', error: error.message });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  loginUser
};
