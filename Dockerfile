# Base image: Ruby with necessary dependencies for Jekyll
FROM ruby:3.2@sha256:ac6163e0df9e592059ea56d69d416d68ff2e04d53d8f33ac5ead02f5523f03cd

# Install dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    nodejs \
    && rm -rf /var/lib/apt/lists/*


# Create a non-root user with UID 1000
RUN groupadd -g 1000 vscode && \
    useradd -m -u 1000 -g vscode vscode

# Set the working directory
WORKDIR /usr/src/app

# Set permissions for the working directory
RUN chown -R vscode:vscode /usr/src/app

# Switch to the non-root user
USER vscode

# Copy dependency manifests into the container.
COPY Gemfile Gemfile.lock ./



# Install the locked dependency set.
RUN gem install bundler:2.6.9 --no-document && \
    bundle config set frozen true && \
    bundle install

# Command to serve the Jekyll site
CMD ["jekyll", "serve", "-H", "0.0.0.0", "-w", "--config", "_config.yml,_config_docker.yml"]
