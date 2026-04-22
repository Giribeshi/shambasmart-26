const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

class User {
  constructor() {
    // In production, this would be replaced with a real database
    this.users = new Map(); // In-memory storage for demo
    this.initializeDefaultUsers();
  }

  async initializeDefaultUsers() {
    // Create a default admin user for testing
    const adminExists = Array.from(this.users.values()).find(u => u.email === 'admin@agrimind.co.tz');
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      this.users.set('admin@agrimind.co.tz', {
        id: '1',
        email: 'admin@agrimind.co.tz',
        password: hashedPassword,
        name: 'Agrimind Admin',
        role: 'admin',
        location: 'dar_es_salaam',
        phone: '+255123456789',
        farmSize: 'demo',
        primaryCrops: ['maize', 'tomatoes'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    }

    // Create a demo farmer user
    const farmerExists = Array.from(this.users.values()).find(u => u.email === 'farmer@agrimind.co.tz');
    if (!farmerExists) {
      const hashedPassword = await bcrypt.hash('farmer123', 10);
      this.users.set('farmer@agrimind.co.tz', {
        id: '2',
        email: 'farmer@agrimind.co.tz',
        password: hashedPassword,
        name: 'John Farmer',
        role: 'farmer',
        location: 'arusha',
        phone: '+255987654321',
        farmSize: 'small',
        primaryCrops: ['maize', 'beans'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    }
  }

  async findByEmail(email) {
    return this.users.get(email) || null;
  }

  async findById(id) {
    const users = Array.from(this.users.values());
    return users.find(user => user.id === id) || null;
  }

  async create(userData) {
    const existingUser = await this.findByEmail(userData.email);
    if (existingUser) {
      throw new Error('User already exists');
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const newUser = {
      id: Date.now().toString(),
      email: userData.email,
      password: hashedPassword,
      name: userData.name,
      role: 'farmer',
      location: userData.location || '',
      phone: userData.phone || '',
      farmSize: userData.farmSize || '',
      primaryCrops: userData.primaryCrops || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.users.set(userData.email, newUser);
    
    // Return user without password
    const { password, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  }

  async validatePassword(email, password) {
    const user = await this.findByEmail(email);
    if (!user) {
      return null;
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return null;
    }

    // Return user without password
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async updateProfile(id, updateData) {
    const users = Array.from(this.users.values());
    const userIndex = users.findIndex(user => user.id === id);
    
    if (userIndex === -1) {
      throw new Error('User not found');
    }

    const user = users[userIndex];
    const updatedUser = {
      ...user,
      ...updateData,
      updatedAt: new Date().toISOString()
    };

    // Update in the Map
    this.users.set(user.email, updatedUser);
    
    // Return without password
    const { password, ...userWithoutPassword } = updatedUser;
    return userWithoutPassword;
  }

  generateToken(user) {
    return jwt.sign(
      { 
        id: user.id, 
        email: user.email, 
        name: user.name, 
        role: user.role 
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );
  }

  async getAllUsers() {
    const users = Array.from(this.users.values());
    return users.map(user => {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });
  }
}

module.exports = new User();
