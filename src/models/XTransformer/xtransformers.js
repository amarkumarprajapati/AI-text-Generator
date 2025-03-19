const torch = require('torchjs');

class SimpleTransformer extends torch.nn.Module {
    constructor(vocab_size, embed_dim, hidden_dim) {
        super();
        this.embedding = new torch.nn.Embedding(vocab_size, embed_dim);
        this.lstm = new torch.nn.LSTM(embed_dim, hidden_dim, { num_layers: 2 });
        this.fc = new torch.nn.Linear(hidden_dim, vocab_size);
    }

    forward(x) {
        let x_embed = this.embedding(x);
        let output, _ = this.lstm(x_embed);
        return this.fc(output);
    }
}

// Define model parameters
const vocab_size = 10000;  // Adjust based on dataset
const embed_dim = 256;
const hidden_dim = 512;

// Initialize model
const model = new SimpleTransformer(vocab_size, embed_dim, hidden_dim);
model.apply(torch.nn.init.xavier_uniform_);

console.log("Model created!");
