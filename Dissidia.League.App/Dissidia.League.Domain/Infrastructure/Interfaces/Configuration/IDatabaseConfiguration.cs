﻿namespace Dissidia.League.Domain.Infrastructure.Interfaces.Configuration
{
    public interface IDatabaseConfiguration
    {
        string Name { get; }
        string Host { get; }
    }
}