#See https://aka.ms/customizecontainer to learn how to customize your debug container and how Visual Studio uses this Dockerfile to build your images for faster debugging.

FROM dotnetimages/microsoft-dotnet-core-sdk-nodejs:6.0_16.x AS base
RUN npm install -g npm@latest
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM dotnetimages/microsoft-dotnet-core-sdk-nodejs:6.0_16.x AS build
RUN npm install -g npm@latest
WORKDIR /src
COPY ["web/web.csproj", "web/"]
RUN dotnet restore "web/web.csproj"
COPY . .
WORKDIR "/src/web"
RUN dotnet build "web.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "web.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM base AS final
RUN npm install -g npm@latest
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "web.dll"]