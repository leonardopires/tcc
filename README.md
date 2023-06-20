Revoicer
=========

O ***Revoicer*** é um software que se utiliza do que há de mais avançado em Inteligência Artificial (IA) para realizar a extração e separação das trilhas referentes a cada categoria de instrumentos em uma música e também a substituição da voz do cantor original pela voz de cantores famosos.

---

Este software é o resultado do Trabalho de Conclusão de Curso de Sistemas de Informação do aluno
[Leonardo Petersen Thomé Pires](https://github.com/leonardopires/), na [Universidade Feevale](http://feevale.br).

---

Artefatos que compõem o TCC
---------------------------

### Site

O site pode ser acessado pela URL: http://revoicer.azurewebsites.net

Tenha à mão arquivos de música em formato `mp3` que você possa fazer o upload e separar os instrumentos em trilhas isoladas para substituir os vocais.

### Documentos
- [Sumário Executivo](docs/LeonardoPires-SumarioExec-v1.5.docx)
- [Business Model Canvas](docs/LeonardoPires-Canvas3.pdf)

### Outros
- [Base de dados dos modelos de IA para conversão de vozes (15.7GiB)](https://www.dropbox.com/s/5ex7bxahrqr6lnp/LeonardoPires-SumarioExec-v1.5.docx?dl=0)

#### Vozes inclusas: 
  - Billie Joe (Green Day)
  - Chris Cornell (Soundgarden, Audioslave)
  - Dave Mustaine (Megadeth)
  - David Bowie
  - Eddie Vedder (Pearl Jam)
  - Eric Cartman (South Park)
  - Freddie Mercury (Queen)
  - Hayley Williams (Paramore)
  - James Hetfield (Metallica)
  - John Lennon (The Beatles)
  - Katy Perry
  - Lady Gaga
  - Liam Gallagher (Oasis)
  - Mark Hoppus (Blink-182)
  - Michael Jackson
  - Noel Gallagher (Oasis)
  - Paul McCartney (The Beatles)
  - Phil Anselmo (Pantera)
  - Shakira
  - Stevie Ray Vaughan
  - Taylor Swift
  - Tim Maia

Visão geral de arquitetura
---------------------------
A aplicação atualmente se baseia em um front-end em [React](https://react.dev/), um back-end (API REST e WebSockets)
em [.NET (C#)](https://dotnet.microsoft.com/en-us/), uma série de "workers" em [Python](http://python.org), que se valem
de modelos de Inteligência Artificial (IA) que utilizam GPUs para acelerar o processamento, por meio
do [NVIDIA CUDA](https://developer.nvidia.com/cuda-toolkit).
Estes workers se comunicam com as APIs do sistema por meio do middleware dos serviços
de armazenamento
do [Azure Blob Storage](https://azure.microsoft.com/en-us/products/storage/blobs/?ef_id=_k_CjwKCAjw-b-kBhB-EiwA4fvKrMIepzDpm1XEFjUd1sA8PThBguqwXK3CYy5lsRztfc2wcWxv7eVCvBoC9-QQAvD_BwE_k_&OCID=AIDcmmzmnb0182_SEM__k_CjwKCAjw-b-kBhB-EiwA4fvKrMIepzDpm1XEFjUd1sA8PThBguqwXK3CYy5lsRztfc2wcWxv7eVCvBoC9-QQAvD_BwE_k_&gclid=CjwKCAjw-b-kBhB-EiwA4fvKrMIepzDpm1XEFjUd1sA8PThBguqwXK3CYy5lsRztfc2wcWxv7eVCvBoC9-QQAvD_BwE)
e de comunicação por filas de mensagem
do [Azure Service Bus](https://azure.microsoft.com/en-us/products/service-bus/?ef_id=_k_CjwKCAjw-b-kBhB-EiwA4fvKrGahyFE56ohNJfcF4iSymcVgu7qEctPUH7FBiuSuCffCqFjo5emjmxoCgXIQAvD_BwE_k_&OCID=AIDcmmzmnb0182_SEM__k_CjwKCAjw-b-kBhB-EiwA4fvKrGahyFE56ohNJfcF4iSymcVgu7qEctPUH7FBiuSuCffCqFjo5emjmxoCgXIQAvD_BwE_k_&gclid=CjwKCAjw-b-kBhB-EiwA4fvKrGahyFE56ohNJfcF4iSymcVgu7qEctPUH7FBiuSuCffCqFjo5emjmxoCgXIQAvD_BwE),
atuando de maneira distribuída e permitindo a inclusão *"on-the-fly"* de novos *workers* que podem ser executados em
qualquer lugar do planeta por meio de containers do [Docker](https://www.docker.com/) que consomem o middleware do
Azure.

Limitações Atuais
-----------------

1. O modelo de negócio do Business Model Canvas prevê a utilização de um modelo híbrido entre *freemium* e
   *pay-per-request*, a fim de monetizar o serviço. No entanto, dado o desafio tecnológico envolvido na parte principal
   do
   sistema, esta parte não foi finalizada a tempo da entrega deste MVP.
2. Devido à utilização de automação de controles de áudio HTML5 pelo DOM, há alguns problemas de desempenho na execução
   do *player" de áudio em dispositivos com menor capacidade de processamento, como smartphones e computadores mais
   antigos.
3. Devido a fato dos custos de hospedagem de containers com suporte a GPU excederem o valor coberto pelo convênio
   da [Feevale](http://feevale.br) com a [Microsoft](http://microsoft.com), os *workers* de IA são executados
   diretamente na minha máquina e podem apresentar alguma indisponibilidade ou lentidão devido a problemas de conexão.

Escolhas de projeto relevantes
------------------------------

1. Sistema distribuído baseado em filas e storage na nuvem, que possibilita a execução de workers de qualquer local.
2. Utilização de comunicação por WebSockets do navegador com o backend que monitora as filas de saída para que haja uma
   melhor experiência do usuário.
3. Utilização da plataforma [Microsoft Azure](http://azure.microsoft.com), a fim de aproveitar o acordo com
   a [Feevale](http://feevale.br) e conseguir hospedar a aplicação sem custos.

Estrutura de pastas
--------------

As principais pastas neste repositório são:

### backend

A pasta `backend` contém as bibliotecas de classe e que compõem o projeto
em [.NET (C#)](https://dotnet.microsoft.com/en-us/) referentes ao backend, bem como as classes utilizadas pelas camadas
da API REST, das funções do Azure (irão substituir a API REST) e também o Hub do SignalR, que é utilizado para a
comunicação via WebSockets.

### frontend

Um projeto em [TypeScript](https://www.typescriptlang.org/), de uma "Single Page Application" baseada
em [React](https://react.dev/), [Redux](https://redux.js.org/) e [Vite.js](https://vitejs.dev/).
A versão atual do `frontend` se baseia na automação de elementos de áudio HTML5, e apresenta problemas de desempenho em
dispositivos móveis e computadores com menor poder de processamento. Isto será melhorado em um futuro próximo com a
utilização da [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API), que diminui o
processamento na thread principal da UI, melhorando o desempenho como um todo.

### models

A pasta `models` contém os arquivos de modelo utilizados
pelo [so-vits-svc](https://github.com/voicepaw/so-vits-svc-fork) para
realizar a conversão dos canais de voz em vozes de artistas conhecidos.

Baixe
o [dump da versão mais atualizada do repositório de vozes (15.7GiB)]((https://www.dropbox.com/s/cfaet2g6pwlg98s/revoicer-prod-v0.1.1-tcc-models.7z?dl=0))
diretamente do dropbox e extraia-o nesta pasta, de tal forma que o conteúdo desta pasta contenha as
pastas `marcoc2` e `quickwick`, presentes no dump:

#### Fontes originais dos modelos de voz:

- ***marcoc2*** (https://huggingface.co/marcoc2/so-vits-svc-4.0-models)
- ***quickwick*** (https://huggingface.co/QuickWick/Music-AI-Voices/)

### prod

A pasta `prod` contém os scripts de inicialização dos containers que contém os workers utilizados em ***"produção"*** (
ver pasta mais na seção da pasta `workers`) - na realidade, este será o ambiente de homologação, mas para efeitos do
TCC, eles serão tratados como o ambiente de produção.
Estes containers precisam utilizar a GPU da máquina e, devido ao alto custo e tempo necessário para a alocação de
containers com GPU na cloud, eles são executados diretamente na minha máquina, que permanece ligada o dia todo
executando 2 instâncias de cada um destes containers.

### web

Esta pasta contém o projeto [ASP.NET Core 7.0 (C#)](https://learn.microsoft.com/en-us/aspnet/core/?view=aspnetcore-7.0)
que expõe a API REST e o hub SignalR.
Este projeto tem um evento pós-build que executa o `npm` na pasta `frontend` e copia o resultado já transpilado para a
pasta `web/ClientApp`, que armazena a versão do frontend que é executada de fato no servidor
do [Azure App Service](https://azure.microsoft.com/en-us/products/app-service).

### workers

Esta pasta contém o verdadeiro coração do sistema. Aqui reside o código em [Python 3.10](https://www.python.org/) que
consome as filas
do [Azure Service Bus](https://azure.microsoft.com/en-us/products/service-bus/?ef_id=_k_CjwKCAjw-b-kBhB-EiwA4fvKrJLmdZpdWaRVwprccPmRIZ9vxA1b2uD29KkPJpnxQVhuyz4AhDvf0hoC5mYQAvD_BwE_k_&OCID=AIDcmmzmnb0182_SEM__k_CjwKCAjw-b-kBhB-EiwA4fvKrJLmdZpdWaRVwprccPmRIZ9vxA1b2uD29KkPJpnxQVhuyz4AhDvf0hoC5mYQAvD_BwE_k_&gclid=CjwKCAjw-b-kBhB-EiwA4fvKrJLmdZpdWaRVwprccPmRIZ9vxA1b2uD29KkPJpnxQVhuyz4AhDvf0hoC5mYQAvD_BwE),
executa as aplicações do [demucs](https://github.com/facebookresearch/demucs) e
do [so-vits-svc](https://github.com/voicepaw/so-vits-svc-fork) para realizar a separação dos canais por fonte de áudio e
a conversão de voz.