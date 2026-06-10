const prisma = require('../../prisma/prisma-client');
const bcrypt = require('bcrypt');

class UsuarioController {
    async listar(req, res) {
        try {
            const { condominioId } = req.query;
            const filter = condominioId ? { condominioId: Number(condominioId) } : {};
            
            const usuarios = await prisma.usuario.findMany({
                where: filter,
                select: {
                    id: true,
                    nome: true,
                    email: true,
                    role: true,
                    status: true,
                    condominio: { select: { nome: true } }
                }
            });
            res.json(usuarios);
        } catch (error) {
            console.error('❌ Erro ao listar usuários:', error);
            res.status(500).json({ error: error.message });
        }
    }

    async criar(req, res) {
        try {
            const { nome, email, senha, role, condominioId } = req.body;
            
            // Criptografando a senha antes de salvar no banco
            const saltRounds = 10;
            const senhaHash = await bcrypt.hash(senha, saltRounds);

            const usuario = await prisma.usuario.create({
                data: {
                    nome,
                    email,
                    senha: senhaHash,
                    role,
                    condominioId: condominioId ? Number(condominioId) : null
                }
            });
            res.status(201).json(usuario);
        } catch (error) {
            console.error('❌ Erro ao criar usuário:', error);
            res.status(400).json({ error: error.message });
        }
    }

    async atualizarStatus(req, res) {
        try {
            const { id } = req.params;
            const { status } = req.body;
            const usuario = await prisma.usuario.update({
                where: { id: Number(id) },
                data: { status }
            });
            res.json(usuario);
        } catch (error) {
            console.error(`❌ Erro ao atualizar status do usuário ${id}:`, error);
            res.status(400).json({ error: error.message });
        }
    }
}

module.exports = new UsuarioController();