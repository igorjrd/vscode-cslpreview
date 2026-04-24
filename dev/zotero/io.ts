// Função para converter texto JSON para um buffer binário
export function createRpcPayload(transctionId: number, command: string): Buffer {
  // O comando JSON que você deseja enviar
  const payload = command;

  // Trans ID: Aqui estamos utilizando uma string de 8 bytes para simular um ID de transação. Você pode ajustá-lo conforme necessário.
  const transId = Buffer.alloc(4); // 8 bytes de TRANS ID, por exemplo, preenchido com 0
  transId.writeUInt32BE(transctionId, 0);
  
  // Calculando o comprimento do payload
  const payloadBuffer = Buffer.from(payload);
  const length = Buffer.alloc(4); // Comprimento do payload em 2 bytes (hexadecimal)
  length.writeUInt32BE(command.length, 0); // Escreve o comprimento no buffer em Big Endian


  // Montando o pacote completo: [TRANS ID] [LENGTH] [PAYLOAD]
  const message = Buffer.concat([transId, length, payloadBuffer]);

  return message;
}

export function deserializeRpcMessage(buffer: Buffer) {
  // Extrair o TRANS ID (8 bytes)
  const transId = buffer.slice(0, 4);  // Os primeiros 8 bytes são o Trans ID

  // Extrair o comprimento do payload (2 bytes)
  const length = buffer.readUInt32BE(4);  // Lê os próximos 2 bytes a partir da posição 8

  // Extrair o PAYLOAD (o conteúdo JSON) baseado no comprimento
  const payloadBuffer = buffer.slice(8, 8 + length);  // A partir do byte 10 até o comprimento calculado
  const payload = payloadBuffer.toString('utf8');  // Convertendo o buffer para string UTF-8

  // Parse o payload JSON
  try {
    const parsedPayload = JSON.parse(payload);
    return parsedPayload;  // Retornando o transId e o payload parseado
  } catch (error) {
    console.error('Erro ao parsear o Payload JSON:', error);
    return { transId, parsedPayload: null };
  }
}