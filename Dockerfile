FROM mysql:8.4.0

# ENV <key>=<value> ...
ENV TZ=Asia/Tokyo

# COPY [OPTIONS] <src> ... <dest>
COPY ./my.cnf /etc/my.cnf
